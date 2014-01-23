'use strict';

import ReactTypescript = require('./react-typescript');
import Utils = require('./utils');
import registry = require('../registry');

function  computeKey(props: any): string {
    return Object.keys(props)
        .filter(prop => prop !== '__owner__' && prop !== 'children')
        .sort()
        .map(prop => registry.modelWrapper.getRev(props[prop]))
        .join('');
}

class ObserverDecorator implements ReactTypescript.ReactDecorator<ReactTypescript.ReactComponent<any, any>> {
    private _key: string;
    
    constructor(
        private component: ReactTypescript.ReactComponent<any, any>
    ){}
    
    componentDidMount() {
        this._key = computeKey(this.component.props);
    }
    

    // We consider that components should react to changes dispatched by Object.observe
    // or to props change, if we want to track properties of objects in our 'props'
    // we just observe them
    shouldComponentUpdate(nextProps: any, nextState: any) {
        return this._key !== computeKey(nextProps);
    }
    
    componentDidUpdate() {
        this._key = computeKey(this.component.props);
    }
}



export = ObserverDecorator;
