'use strict';

import ReactTypescript = require('./react-typescript');
import Utils = require('./utils');
import registry = require('../registry');


function shallowEqual(objA :any, objB :any) {
    if (objA === objB) {
        return true;
    }
    var key: string;
    // Test for A's keys different from B.
    for (key in objA) {
        if (objA.hasOwnProperty(key) &&
            (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
            return false;
        }
    }
    // Test for B'a keys missing from A.
    for (key in objB) {
        if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

function computeProps(props: any): any {
    return Object.keys(props)
        .sort()
        .reduce((computed: any, prop: string)  => {
            if (prop !== '__owner__' && prop !== 'children') {
                computed[prop] = registry.modelWrapper.getRev(props[prop]) || props[prop];
            }
            return computed;
        }, {});
}
class ObserverDecorator implements ReactTypescript.ReactDecorator<ReactTypescript.ReactComponent<any, any>> {
    private _computeProps: any;
    
    constructor(
        private component: ReactTypescript.ReactComponent<any, any>
    ){}
    
    componentDidMount() {
        this._computeProps = computeProps(this.component.props);
    }
    

    // We consider that components should react to changes dispatched by Object.observe
    // or to props change, if we want to track properties of objects in our 'props'
    // we just observe them
    shouldComponentUpdate(nextProps: any, nextState: any) {
        return !shallowEqual(this._computeProps, computeProps(nextProps)) || !shallowEqual(this.component.state, nextState)
    }
    
    componentDidUpdate() {
        this._computeProps = computeProps(this.component.props);
    }
}



export = ObserverDecorator;
