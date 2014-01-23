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

export interface Controller<C extends ReactTypescript.ReactComponent<any, any>> {

    componentDidMount(component: C): void;

    componentWillUnmount(component: C): void;
}

export class ControllerRegistry {
    private controlMap : { [view:string]: Controller<ReactTypescript.ReactComponent<any, any>>} = {}
    registerController<C extends ReactTypescript.ReactComponent<any, any>>(componentClass: { new(): C; prototype: C }, controller: Controller<C>) {
        this.controlMap[componentClass['name']] = controller;
    }
    
    getController(name : string): Controller<any> {
        if (this.controlMap.hasOwnProperty(name)) {
            return this.controlMap[name];
        }
        return null;
    }
    
    private static _instance: ControllerRegistry;
    static get instance(): ControllerRegistry {
        if (!ControllerRegistry._instance) {
            ControllerRegistry._instance = new ControllerRegistry();
        }
        return ControllerRegistry._instance;
    }
}

export class ControlledDecorator implements ReactTypescript.ReactDecorator<ReactTypescript.ReactComponent<any, any>> {
    private _key: string;
    
    constructor(
        private component: ReactTypescript.ReactComponent<any, any>
    ){}
    
    componentDidMount() {
        var controller = ControllerRegistry.instance.getController(this.component.displayName);
        if (controller) {
            controller.componentDidMount(this.component)
        }
    }
    
    componentWillUnmount() {
        var controller = ControllerRegistry.instance.getController(this.component.displayName);
        if (controller) {
            controller.componentWillUnmount(this.component)
        }
    }
}



