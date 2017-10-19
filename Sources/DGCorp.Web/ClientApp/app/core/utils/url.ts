export function isAbsolute(url: string) {
    return /^(?:https?:)?\/\//i.test(url);
}
