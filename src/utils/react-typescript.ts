
'use strict';

import React = require('react/addons');

export class ReactComponentBase<P, S> {
    props: P;
    state: S;
    refs: { [ref: string]: React.ReactComponent<any, any>; }
    getDOMNode(): Element {
        return null;
    }
    
    setProps(nextProps: P): void {
        
    }
    
    replaceProps(nextProps: P): void {
        
    }
    
    
    transferPropsTo<C extends React.ReactComponent<P, any>>(target: C): C {
        return target;
    }
    
    setState(nextProps: S): void {
        
    }
    
    replaceState(nextProps: S): void {
        
    }
    
    forceUpdate(callback? : () => void) {
        
    }
} 





//in fact ReactComponentBase is just a 'fake class that give use typing when creating 'spec'';
(<any>ReactComponentBase)['prototype'] = Object.prototype;

// interface that our components definition WILL have to extends
export interface ReactComponent<P,S> extends React.ReactComponentSpec<P,S>, ReactComponentBase<P,S> {
    render(): React.ReactComponent<any, any>;
}


// we cannot have 'mixin' with typescript
// but being able to listen to lifecycle of component can be quite interesting
// we so create a system of decorator
export interface ReactDecorator<C extends ReactComponent<any, any>> {
    componentWillMount?(): void;
    componentDidMount?(): void;
    componentWillReceiveProps?(nextProps: any): void;
    shouldComponentUpdate?(nextProps: any, nextState: any): boolean;	
    componentWillUpdate?(nextProps: any, nextState: any): void;	
    componentDidUpdate?(nextProps: any, nextState: any): void;
    componentWillUnmount?():void;	
}



export interface Factory<P,C> {
    (protperties?: P, ...comp: any[]) : C;
}


function copy<T>(obj: T): T {
    return Object.keys(obj).reduce((target: T, prop: string) =>  {
        target[prop] = obj[prop];
        return target
    }, Object.create(Object.getPrototypeOf(obj)));
}


class DecoratorRunnerMixin implements React.ReactMixin<any,any> {
    private __decoratorsClass__: { new(component: any): ReactDecorator<any> }[];
    private __decoratorsInstances__: ReactDecorator<any>[];
    
    componentWillMount(): void {
        this.__decoratorsInstances__ = 
            this.__decoratorsClass__.map(decoratorClass => new decoratorClass(this))
        
        this.__decoratorsInstances__.forEach(decorator => {
            if (decorator.componentWillMount) {
                decorator.componentWillMount();
            }
        });
    }

    componentDidMount(): void {
        this.__decoratorsInstances__.forEach(decorator => {
            if (decorator.componentDidMount) {
                decorator.componentDidMount();
            }
        });
    }
    
    componentWillReceiveProps(nextProps: any): void {
        this.__decoratorsInstances__.forEach(decorator => {
            if (decorator.componentWillReceiveProps) {
                decorator.componentWillReceiveProps(nextProps);
            }
        });
    }
    
    shouldComponentUpdate(nextProps: any, nextState: any): boolean {
        return this.__decoratorsInstances__.some(decorator => {
            if (decorator.shouldComponentUpdate) {
                return decorator.shouldComponentUpdate(nextProps, nextState);
            }
            return false;
        });
    }
    
    componentWillUpdate(nextProps: any, nextState: any): void {
        this.__decoratorsInstances__.forEach(decorator => {
            if (decorator.componentWillUpdate) {
                decorator.componentWillUpdate(nextProps, nextState);
            }
        });
    }
    
    componentDidUpdate(nextProps: any, nextState: any): void {
        this.__decoratorsInstances__.forEach(decorator => {
            if (decorator.componentDidUpdate) {
                decorator.componentDidUpdate(nextProps, nextState);
            }
        });
    }
    
    componentWillUnmount():void {
        this.__decoratorsInstances__.forEach(decorator => {
            if (decorator.componentWillUnmount) {
                decorator.componentWillUnmount();
            }
        });
    }
}


export function registerComponent<C extends  ReactComponent<P, any>, P>(
        componentClass: { new(): C; prototype: C; }, 
        ...decorators: { new(component: C): ReactDecorator<C>; prototype: ReactDecorator<C> }[]
    ): Factory<P,C> {
    
        
    var mixins: React.ReactMixin<any, any>[] = (componentClass.prototype.mixins || []).slice(0);
    if (decorators.length) {
        mixins.push(DecoratorRunnerMixin.prototype);
    }
    
    var spec = copy(componentClass.prototype);
    spec.mixins = mixins;
    delete spec['constructor'];
    var componentFactory: Factory<P, C>  = (<any>React.createClass(spec));
    spec.displayName = componentClass['name'];
    return function (properties?: P) {
        var component = componentFactory.apply(this, arguments);
        componentClass.call(component);
        if (decorators.length) {
            component.__decoratorsClass__ = decorators;
        }
        return component;
    }
}
    




