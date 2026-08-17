import { formatCurrency, formatDate, formatDateTime } from './format';
function escapeHtml(text) {
    const entities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };
    return text.replace(/[&<>"']/g, (char) => entities[char]);
}
function buildReceiptHtml(order) {
    const itemsRows = order.items
        .map((item) => {
        const name = escapeHtml(item.suitModelName ?? item.productName ?? 'Artículo');
        const fabric = item.fabricName ? ` — ${escapeHtml(item.fabricName)}` : '';
        return `<tr>
        <td>${name}${fabric}</td>
        <td class="num">${item.quantity}</td>
        <td class="num">${formatCurrency(item.unitPrice)}</td>
        <td class="num">${formatCurrency(item.lineTotal)}</td>
      </tr>`;
    })
        .join('');
    const paymentsRows = order.payments
        .map((payment) => `<tr>
        <td>${payment.paymentType === 'anticipo' ? 'Anticipo' : 'Saldo'} — ${escapeHtml(payment.paymentMethodName)}</td>
        <td class="num">${formatDateTime(payment.paidAt)}</td>
        <td class="num">${formatCurrency(payment.amount)}</td>
      </tr>`)
        .join('');
    const address = order.deliveryAddress;
    const addressBlock = address
        ? `<p><strong>Entrega:</strong> ${escapeHtml(address.line1)}, ${escapeHtml(address.city)}${address.state ? `, ${escapeHtml(address.state)}` : ''}</p>`
        : '';
    return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>Comprobante ${order.orderNumber}</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; color: #26211c; max-width: 640px; margin: 40px auto; padding: 0 24px; }
  h1 { font-size: 1.5rem; margin: 0; letter-spacing: 0.02em; }
  .muted { color: #756a5c; font-size: 0.85rem; margin-top: 2px; }
  .meta { margin-top: 24px; line-height: 1.7; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  th, td { padding: 8px 6px; border-bottom: 1px solid #e2d9c8; font-size: 0.9rem; text-align: left; }
  th { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; color: #756a5c; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .total-row td { font-weight: bold; border-top: 2px solid #26211c; border-bottom: none; font-size: 1rem; }
  h2 { font-size: 0.95rem; margin-top: 28px; }
  footer { margin-top: 40px; color: #756a5c; font-size: 0.8rem; border-top: 1px solid #e2d9c8; padding-top: 16px; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
  <h1>Real Elegance</h1>
  <p class="muted">Sastrería artesanal · Comprobante de pedido</p>

  <div class="meta">
    <p><strong>Pedido:</strong> ${escapeHtml(order.orderNumber)}<br />
    <strong>Cliente:</strong> ${escapeHtml(order.customerName)}<br />
    <strong>Fecha:</strong> ${formatDate(order.createdAt)}<br />
    <strong>Estado:</strong> ${escapeHtml(order.statusName)}</p>
    ${addressBlock}
  </div>

  <table>
    <thead><tr><th>Artículo</th><th class="num">Cant.</th><th class="num">Precio</th><th class="num">Importe</th></tr></thead>
    <tbody>${itemsRows}</tbody>
  </table>

  <table>
    <tbody>
      <tr><td colspan="3">Subtotal</td><td class="num">${formatCurrency(order.subtotal)}</td></tr>
      ${order.discountAmount > 0
        ? `<tr><td colspan="3">Descuento</td><td class="num">−${formatCurrency(order.discountAmount)}</td></tr>`
        : ''}
      <tr><td colspan="3">IVA</td><td class="num">${formatCurrency(order.tax)}</td></tr>
      <tr class="total-row"><td colspan="3">Total</td><td class="num">${formatCurrency(order.total)}</td></tr>
    </tbody>
  </table>

  ${order.payments.length > 0
        ? `<h2>Pagos</h2>
  <table>
    <tbody>${paymentsRows}</tbody>
  </table>`
        : ''}

  <footer>Trajes cortados a mano, uno cada vez. Gracias por confiar en Real Elegance.</footer>
</body>
</html>`;
}
/** Genera el comprobante de `order` y dispara su descarga en el navegador. */
export function downloadReceipt(order) {
    const html = buildReceiptHtml(order);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprobante-${order.orderNumber}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}
//# sourceMappingURL=receipt.js.map