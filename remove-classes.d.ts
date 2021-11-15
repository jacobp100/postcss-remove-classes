import { Plugin } from 'postcss';

export default function removeClasses (
    matchArg: string[]
): Plugin;

export function classNameMatches(matchArg: string | RegExp | string[]): (className: string) => boolean;

export function removeClasses(matchesClassName: (className: string) => boolean, selector: string): string;
