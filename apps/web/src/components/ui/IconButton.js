import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cx } from '@/lib/cx';
import s from './IconButton.module.css';
export const IconButton = forwardRef(function IconButton({ label, icon, variant = 'ghost', size = 'md', badge, className, type = 'button', ...rest }, ref) {
    const showBadge = typeof badge === 'number' && badge > 0;
    return (_jsxs("button", { ref: ref, type: type, className: cx(s.button, s[variant], s[size], className), "aria-label": label, title: label, ...rest, children: [icon, showBadge ? (_jsx("span", { className: s.badge, "aria-hidden": "true", children: badge > 9 ? '9+' : badge })) : null] }));
});
//# sourceMappingURL=IconButton.js.map