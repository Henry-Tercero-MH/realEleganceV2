import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cx } from '@/lib/cx';
import s from './Table.module.css';
/**
 * Tabla del back-office.
 *
 * Es una `<table>` de verdad (no un grid de divs) para conservar la semántica
 * de encabezado/celda que usan los lectores de pantalla.
 */
export function Table({ columns, rows, rowKey, onRowClick, empty, caption, className, }) {
    if (rows.length === 0 && empty) {
        return _jsx("div", { className: cx(s.emptyWrap, className), children: empty });
    }
    return (_jsx("div", { className: cx(s.scroller, className), children: _jsxs("table", { className: s.table, children: [caption ? _jsx("caption", { className: "re-sr-only", children: caption }) : null, _jsx("thead", { children: _jsx("tr", { children: columns.map((column) => (_jsx("th", { scope: "col", style: { width: column.width, textAlign: column.align ?? 'left' }, className: cx(column.hideOnMobile && s.hideOnMobile), children: column.header }, column.id))) }) }), _jsx("tbody", { children: rows.map((row) => (_jsx("tr", { className: cx(onRowClick && s.clickable), onClick: onRowClick ? () => onRowClick(row) : undefined, tabIndex: onRowClick ? 0 : undefined, onKeyDown: onRowClick
                            ? (event) => {
                                if (event.key === 'Enter')
                                    onRowClick(row);
                            }
                            : undefined, children: columns.map((column) => (_jsx("td", { style: { textAlign: column.align ?? 'left' }, className: cx(column.hideOnMobile && s.hideOnMobile), children: column.cell(row) }, column.id))) }, rowKey(row)))) })] }) }));
}
//# sourceMappingURL=Table.js.map