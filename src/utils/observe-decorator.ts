'use strict';

import ReactTypescript = require('./react-typescript');
import Utils = require('./utils');


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


// A simple decorator that will 'observe' objects returned by the 'getObservedObjects' method of 
// components and forceUpdate if they dispatch changes
    
class ObserverDecorator implements ReactTypescript.ReactDecorator<ObserverDecorator.ObserverComponent<any, any>> {
    private _observedObjects: any[];
    
    constructor(
        private component: ObserverDecorator.ObserverComponent<any, any>
    ){}
    
    componentDidMount() {
        this._observeObjects();
    }
    
    componentDidUpdate() {
        if (typeof this.component.getObservedObjects === 'function') {
            if (!shallowEqual(this.component.getObservedObjects(), this._observedObjects)) {
                this._unobserveObjects();
                this._observeObjects();
            }
        }
    }


    // We consider that components should react to changes dispatched by Object.observe
    // or to props change, if we want to track properties of objects in our 'props'
    // we just observe them
    shouldComponentUpdate(nextProps: any, nextState: any) {
        return !shallowEqual(this.component.props, nextProps) ||
               !shallowEqual(this.component.state, nextState);
    }
    
    componentWillUnmount() {
        this._unobserveObjects();
    }
    
    private _observedObjectsChangeHandler = ()  => {
        this.component.forceUpdate();
    }
    
    private _observeObjects() {
        if (typeof this.component.getObservedObjects === 'function') {
            this._observedObjects = this.component.getObservedObjects();
            this._observedObjects.forEach(function (object) {
                Utils.observe(object, this._observedObjectsChangeHandler);
            }, this);
        }
    }
    
    private _unobserveObjects() {
        if (this._observedObjects) {
            this._observedObjects.forEach(function (object) {
                (<any>Object).unobserve(object, this._observedObjectsChangeHandler);
            }, this);
        } 
    }
}

module ObserverDecorator {
    export interface ObserverComponent<P, S> extends ReactTypescript.ReactComponent<P, S> {
        getObservedObjects?(): any []
    }
}




export = ObserverDecorator;
