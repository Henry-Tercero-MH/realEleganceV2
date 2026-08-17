import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const PATHS = {
    // Navegación y controles
    menu: _jsx("path", { d: "M3 6h18M3 12h18M3 18h18" }),
    close: _jsx("path", { d: "M6 6l12 12M18 6L6 18" }),
    chevronDown: _jsx("path", { d: "M6 9l6 6 6-6" }),
    chevronUp: _jsx("path", { d: "M6 15l6-6 6 6" }),
    chevronRight: _jsx("path", { d: "M9 6l6 6-6 6" }),
    chevronLeft: _jsx("path", { d: "M15 6l-6 6 6 6" }),
    arrowRight: _jsx("path", { d: "M4 12h15m0 0l-6-6m6 6l-6 6" }),
    arrowLeft: _jsx("path", { d: "M20 12H5m0 0l6-6m-6 6l6 6" }),
    check: _jsx("path", { d: "M4 12.5l5 5L20 6.5" }),
    plus: _jsx("path", { d: "M12 5v14M5 12h14" }),
    minus: _jsx("path", { d: "M5 12h14" }),
    search: (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "11", cy: "11", r: "7" }), _jsx("path", { d: "M20 20l-3.5-3.5" })] })),
    filter: _jsx("path", { d: "M3 5h18M6 12h12M10 19h4" }),
    drag: (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "9", cy: "6", r: "1.2" }), _jsx("circle", { cx: "15", cy: "6", r: "1.2" }), _jsx("circle", { cx: "9", cy: "12", r: "1.2" }), _jsx("circle", { cx: "15", cy: "12", r: "1.2" }), _jsx("circle", { cx: "9", cy: "18", r: "1.2" }), _jsx("circle", { cx: "15", cy: "18", r: "1.2" })] })),
    // Sastrería — el vocabulario propio de la marca
    scissors: (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "6", cy: "6", r: "2.5" }), _jsx("circle", { cx: "6", cy: "18", r: "2.5" }), _jsx("path", { d: "M8 7.5L20 18M20 6L8 16.5" })] })),
    ruler: (_jsxs(_Fragment, { children: [_jsx("rect", { x: "2", y: "8", width: "20", height: "8", rx: "1.5" }), _jsx("path", { d: "M7 8v3M11 8v4M15 8v3M19 8v4" })] })),
    hanger: (_jsxs(_Fragment, { children: [_jsx("path", { d: "M12 8.5a2.5 2.5 0 1 1 2.5-2.5" }), _jsx("path", { d: "M12 8.5v2L3.6 16a1.2 1.2 0 0 0 .7 2.2h15.4a1.2 1.2 0 0 0 .7-2.2L12 10.5" })] })),
    needle: _jsx("path", { d: "M20 4L9 15m0 0l-2.5 5.5L12 18M9 15l-2-2" }),
    spool: (_jsxs(_Fragment, { children: [_jsx("rect", { x: "6", y: "3", width: "12", height: "18", rx: "2" }), _jsx("path", { d: "M6 8h12M6 12h12M6 16h12" })] })),
    // Comercio
    cart: (_jsxs(_Fragment, { children: [_jsx("path", { d: "M2.5 4h2.2l2.3 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.3L20.5 8H6" }), _jsx("circle", { cx: "9", cy: "20", r: "1.4" }), _jsx("circle", { cx: "18", cy: "20", r: "1.4" })] })),
    tag: (_jsxs(_Fragment, { children: [_jsx("path", { d: "M3 11.5V4a1 1 0 0 1 1-1h7.5a1 1 0 0 1 .7.3l8.5 8.5a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 12.2a1 1 0 0 1-.3-.7z" }), _jsx("circle", { cx: "7.5", cy: "7.5", r: "1.3" })] })),
    creditCard: (_jsxs(_Fragment, { children: [_jsx("rect", { x: "2", y: "5", width: "20", height: "14", rx: "2" }), _jsx("path", { d: "M2 10h20M6 15h4" })] })),
    truck: (_jsxs(_Fragment, { children: [_jsx("path", { d: "M2 6h11v10H2zM13 9h4.5l3.5 3.5V16h-8" }), _jsx("circle", { cx: "7", cy: "18", r: "1.6" }), _jsx("circle", { cx: "17", cy: "18", r: "1.6" })] })),
    package: (_jsxs(_Fragment, { children: [_jsx("path", { d: "M12 2.5l8.5 4.5v9L12 20.5 3.5 16V7z" }), _jsx("path", { d: "M3.5 7L12 11.5 20.5 7M12 11.5v9" })] })),
    // Cuenta y sesión
    user: (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "12", cy: "8", r: "3.5" }), _jsx("path", { d: "M4.5 20a7.5 7.5 0 0 1 15 0" })] })),
    logout: _jsx("path", { d: "M15 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h9M11 12h10m0 0l-3-3m3 3l-3 3" }),
    settings: (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "12", cy: "12", r: "3" }), _jsx("path", { d: "M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" })] })),
    // Estado y avisos
    calendar: (_jsxs(_Fragment, { children: [_jsx("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }), _jsx("path", { d: "M3 10h18M8 3v4M16 3v4" })] })),
    clock: (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "12", cy: "12", r: "9" }), _jsx("path", { d: "M12 7v5.2l3.2 2" })] })),
    alert: (_jsxs(_Fragment, { children: [_jsx("path", { d: "M12 3.5L22 20H2z" }), _jsx("path", { d: "M12 10v4.5M12 17.2v.1" })] })),
    info: (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "12", cy: "12", r: "9" }), _jsx("path", { d: "M12 11v5.5M12 7.8v.1" })] })),
    checkCircle: (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "12", cy: "12", r: "9" }), _jsx("path", { d: "M8 12.3l2.7 2.7L16 9.7" })] })),
    sparkle: _jsx("path", { d: "M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" }),
    star: _jsx("path", { d: "M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z" }),
    // Back-office
    dashboard: (_jsxs(_Fragment, { children: [_jsx("rect", { x: "3", y: "3", width: "7.5", height: "8", rx: "1.5" }), _jsx("rect", { x: "13.5", y: "3", width: "7.5", height: "5", rx: "1.5" }), _jsx("rect", { x: "3", y: "14", width: "7.5", height: "7", rx: "1.5" }), _jsx("rect", { x: "13.5", y: "11", width: "7.5", height: "10", rx: "1.5" })] })),
    image: (_jsxs(_Fragment, { children: [_jsx("rect", { x: "3", y: "4", width: "18", height: "16", rx: "2" }), _jsx("circle", { cx: "8.5", cy: "9.5", r: "1.6" }), _jsx("path", { d: "M3.5 17l4.8-4.5a1.6 1.6 0 0 1 2.2 0L16 18M15 14l1.7-1.6a1.6 1.6 0 0 1 2.2 0l1.6 1.5" })] })),
    upload: _jsx("path", { d: "M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16" }),
    download: _jsx("path", { d: "M12 4v12m0 0l-4.5-4.5M12 16l4.5-4.5M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16" }),
    edit: _jsx("path", { d: "M4 20h4L20 8a2.1 2.1 0 0 0-3-3L5 17z" }),
    trash: _jsx("path", { d: "M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13M10 11v6M14 11v6" }),
    eye: (_jsxs(_Fragment, { children: [_jsx("path", { d: "M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z" }), _jsx("circle", { cx: "12", cy: "12", r: "3" })] })),
    users: (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "9", cy: "8", r: "3.2" }), _jsx("path", { d: "M2.8 19.5a6.2 6.2 0 0 1 12.4 0" }), _jsx("path", { d: "M16 5.4a3.2 3.2 0 0 1 0 5.2M17.5 14.2a6.2 6.2 0 0 1 3.7 5.3" })] })),
    // Tema
    sun: (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "12", cy: "12", r: "4" }), _jsx("path", { d: "M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" })] })),
    moon: _jsx("path", { d: "M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" }),
    // Redes
    instagram: (_jsxs(_Fragment, { children: [_jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "5" }), _jsx("circle", { cx: "12", cy: "12", r: "4" }), _jsx("circle", { cx: "17.2", cy: "6.8", r: "0.6", fill: "currentColor", stroke: "none" })] })),
};
export function Icon({ name, size = 20, title, ...rest }) {
    return (_jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", role: title ? 'img' : undefined, "aria-hidden": title ? undefined : true, focusable: "false", ...rest, children: [title ? _jsx("title", { children: title }) : null, PATHS[name]] }));
}
//# sourceMappingURL=Icon.js.map