
'use strict';

import React = require('react/addons');

export class ReactComponentBase<P, S> {
    
    constructor(props: P, ...childen: any[]) {
        this.construct.apply(this, arguments);
    }
    
    mixins: React.ReactMixin<any, any>[];
    props: P;
    state: S;
    refs: { [ref: string]: React.ReactComponent<any, any>; }
    getDOMNode(): Element {
        return null;
    }
    setProps: (nextProps: P) => void;
    replaceProps:(nextProps: P) => void
    transferPropsTo:<C extends React.ReactComponent<P, any>>(target: C) => C
    setState: (nextProps: S) => void
    replaceState: (nextProps: S) => void;
    forceUpdate: (callback? : () => void) => void;

    private construct: (props: P, ...childen: any[]) => void
    
    
    static register() {
        if (this === ReactComponentBase) {
            throw new Error('ReactComponentBase should not be registred');
        }
        var spec = copy(this.prototype);
        delete spec['constructor'];
        var componentFactory: any  = (<any>React.createClass(<any>spec));
        this.prototype = componentFactory.componentConstructor.prototype;
        this.prototype['constructor'] = this;
    }
    
    private __decoratorsClass__: { new(c: ReactComponent<any, any>): ReactDecorator<any> }[];
    
    static decorate(...decorators: { new(c: ReactComponent<any, any>): ReactDecorator<any> }[] ) {
        if (!this.prototype.__decoratorsClass__ ) {
            this.prototype.mixins = (this.prototype.mixins || []).concat(DecoratorRunnerMixin.prototype);
            this.prototype.__decoratorsClass__ = decorators;
        } else {
            this.prototype.__decoratorsClass__ = this.prototype.__decoratorsClass__.concat(decorators);
        }
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
        if (!this.shouldComponentUpdate) {
            this.shouldComponentUpdate = (nextProps: any, nextState: any) => {
                return this.__decoratorsInstances__.some(decorator => {
                    if (decorator.shouldComponentUpdate) {
                        return decorator.shouldComponentUpdate(nextProps, nextState);
                    }
                    return false;
                });
            }
        }
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
    
    shouldComponentUpdate:(nextProps: any, nextState: any) => boolean;
    
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



    




