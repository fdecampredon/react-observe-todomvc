declare module React {
    export module addons {
        export function classSet(obj: { [className: string]: boolean }): string;
    }
}

declare module 'react/addons' {
    export = React;
}