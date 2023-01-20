export function regexPrefixPatern(prefixs: string[]): RegExp {
    const prefixString = prefixs.join("|");
    const regexString = `\\b(${prefixString})`;
    const regex = new RegExp(regexString);
    return regex;
}
