export function cx(...values) {
    let out = '';
    for (const value of values) {
        if (!value && value !== 0)
            continue;
        out = out ? `${out} ${value}` : String(value);
    }
    return out;
}
//# sourceMappingURL=cx.js.map