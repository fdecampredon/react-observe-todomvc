declare module ObserveUtils {
    export function defineObservableProperties(target: {}, ...rest: any[]): void;

    export class List<T> {
        static observe(list: List<any>, callbak: () => void): void;
        static fromArray<T>( array: T[]): List<T>;
            
        set(index: number, value: T): void;
        
        toArray(): T[]
        toJSON(): T[]
        toString(): string;
        
        concat<U extends T[]>(...items: U[]): List<T>
        concat(...items: T[]): List<T>
        join(separator?: string): string;
        pop(): T;
        push(...items: T[]): number;
        reverse(): List<T>
        shift(): T;
        slice(start: number, end?: number): List<T>
        sort(compareFn?: (a: T, b: T) => number): List<T>
        splice(start: number): List<T>
        splice(start: number, deleteCount: number, ...items: T[]): List<T>
        unshift(...items: T[]): number;
        indexOf(searchElement: T, fromIndex?: number): number;
        lastIndexOf(searchElement: T, fromIndex?: number): number;
        every(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean;
        some(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean;
        forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
        filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): List<T>
        reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): T;
        reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
        reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): T;
        reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
        length: number;
    
        [n: number]: T;
    }
}

declare module 'observe-utils' {
    export = ObserveUtils;
}