/**
 * Invoice PDF Templates
 *
 * Each template is a function that receives { invoice, orgInfo } and returns
 * a complete HTML string ready for window.open() + print.
 *
 * Multi-page handling:
 *  - <thead> with display:table-header-group repeats on every printed page
 *  - page-break-inside:avoid on rows prevents mid-row splits
 *  - @page sets consistent margins
 *
 * Govt GST compliance (all templates):
 *  - Supplier name, address, GSTIN
 *  - Buyer name, address, GSTIN
 *  - Invoice #, date, place of supply
 *  - HSN/SAC per line item
 *  - Tax breakdown (CGST/SGST or IGST)
 *  - Total in words (formal template)
 */

// ── Helpers ────────────────────────────────────────────────────
function cur(currency) {
  return currency === 'INR' ? '\u20B9' : '$';
}

function fmt(n, currency) {
  const c = cur(currency);
  return `${c}${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function fmtDateShort(d) {
  return new Date(d).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function calcTotals(lines) {
  const subtotal = lines.reduce((s, l) => s + l.qty * l.rate, 0);
  const tax = lines.reduce((s, l) => s + (l.qty * l.rate * l.taxRate) / 100, 0);
  return { subtotal, tax, grand: subtotal + tax };
}

function lineRows(lines, currency, showHsn = true) {
  return lines
    .map((l, i) => {
      const amt = l.qty * l.rate;
      const taxAmt = (amt * l.taxRate) / 100;
      return `<tr style="page-break-inside:avoid;">
      <td style="text-align:center;color:#6b7280;padding:10px 8px;">${i + 1}</td>
      <td style="padding:10px 8px;"><div style="font-weight:500;">${l.description}</div>${showHsn ? `<div style="font-size:10px;color:#9ca3af;">HSN/SAC: ${l.hsn || '—'}</div>` : ''}</td>
      <td style="text-align:center;padding:10px 8px;">${l.qty}</td>
      <td style="text-align:right;padding:10px 8px;">${fmt(l.rate, currency)}</td>
      <td style="text-align:center;padding:10px 8px;">${l.taxRate}%</td>
      <td style="text-align:right;padding:10px 8px;">${fmt(taxAmt, currency)}</td>
      <td style="text-align:right;padding:10px 8px;font-weight:600;">${fmt(amt + taxAmt, currency)}</td>
    </tr>`;
    })
    .join('');
}

function numberToWords(n) {
  if (n === 0) return 'Zero';
  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];
  const scales = ['', 'Thousand', 'Lakh', 'Crore'];

  const whole = Math.floor(n);
  const decimal = Math.round((n - whole) * 100);

  function convertGroup(num) {
    if (num === 0) return '';
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    return (
      ones[Math.floor(num / 100)] +
      ' Hundred' +
      (num % 100 ? ' and ' + convertGroup(num % 100) : '')
    );
  }

  // Indian numbering: ones, thousands, lakhs, crores
  const parts = [];
  let rem = whole;
  const divisors = [100, 100, 100]; // groups after first 3 digits: 2-digit groups
  const firstGroup = rem % 1000;
  rem = Math.floor(rem / 1000);
  if (firstGroup) parts.push(convertGroup(firstGroup));
  let idx = 1;
  while (rem > 0) {
    const group = rem % 100;
    rem = Math.floor(rem / 100);
    if (group) parts.push(convertGroup(group) + ' ' + scales[idx]);
    idx++;
  }
  parts.reverse();

  let result = parts.join(' ');
  if (decimal > 0) {
    result += ' and ' + convertGroup(decimal) + ' Paise';
  }
  return result + ' Only';
}

// ── Template: Standard ─────────────────────────────────────────
function standardTemplate({ invoice, orgInfo }) {
  const lines = invoice.lineItems || [];
  const { subtotal, tax, grand } = calcTotals(lines);
  const c = orgInfo.currency || 'INR';
  const company = orgInfo.name || 'My Company';

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${invoice.id}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#1a1a2e; font-size:13px; }
  @page { size:A4; margin:20mm 15mm; }
  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
  .page { max-width:760px; margin:0 auto; padding:0; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; padding-bottom:20px; border-bottom:3px solid #6366f1; margin-bottom:24px; }
  .company { font-size:22px; font-weight:700; color:#6366f1; }
  .company-sub { font-size:11px; color:#64748b; line-height:1.7; margin-top:4px; }
  .inv-title { font-size:28px; font-weight:800; color:#1a1a2e; text-align:right; text-transform:uppercase; letter-spacing:1px; }
  .inv-meta { text-align:right; font-size:12px; color:#64748b; margin-top:6px; line-height:1.8; }
  .inv-meta strong { color:#1a1a2e; }
  .status { display:inline-block; padding:3px 12px; border-radius:12px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }
  .status-paid { background:#dcfce7; color:#166534; } .status-sent { background:#dbeafe; color:#1e40af; }
  .status-draft { background:#f1f5f9; color:#475569; } .status-overdue { background:#fee2e2; color:#991b1b; }
  .addresses { display:flex; gap:32px; margin-bottom:20px; }
  .addr-box { flex:1; padding:16px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0; }
  .addr-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#94a3b8; margin-bottom:6px; }
  .addr-name { font-size:14px; font-weight:700; }
  .addr-line { font-size:11px; color:#64748b; line-height:1.6; margin-top:2px; }
  .gstin { display:inline-block; margin-top:4px; padding:2px 6px; background:#ede9fe; color:#6d28d9; border-radius:3px; font-size:10px; font-weight:600; font-family:monospace; }
  .details { display:flex; gap:12px; margin-bottom:20px; }
  .detail { flex:1; padding:10px 14px; background:#fafafa; border-radius:6px; border:1px solid #f0f0f0; }
  .detail-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#94a3b8; }
  .detail-value { font-size:13px; font-weight:600; margin-top:3px; }
  table { width:100%; border-collapse:collapse; }
  thead { display:table-header-group; }
  thead th { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#64748b; padding:10px 8px; border-bottom:2px solid #e2e8f0; background:#f8fafc; }
  tbody td { border-bottom:1px solid #f1f5f9; }
  .totals { display:flex; justify-content:flex-end; margin-top:0; }
  .totals-box { width:280px; }
  .tot-row { display:flex; justify-content:space-between; padding:8px 14px; font-size:12px; color:#475569; border-bottom:1px solid #f1f5f9; }
  .tot-grand { background:#6366f1; color:#fff; font-size:15px; font-weight:700; padding:12px 14px; border-radius:0 0 8px 8px; border-bottom:none; }
  .section { margin-top:24px; padding-top:18px; border-top:1px solid #e2e8f0; }
  .section-grid { display:flex; gap:24px; }
  .section-col { flex:1; }
  .sec-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#94a3b8; margin-bottom:6px; }
  .sec-text { font-size:11px; color:#64748b; line-height:1.7; }
  .footer { margin-top:32px; padding-top:16px; border-top:2px solid #6366f1; display:flex; justify-content:space-between; font-size:10px; color:#94a3b8; }
  .footer-brand { font-weight:700; color:#6366f1; }
</style></head><body>
<div class="page">
  <div class="header">
    <div>
      <div class="company">${company}</div>
      <div class="company-sub">
        ${orgInfo.address ? orgInfo.address + '<br>' : ''}${orgInfo.phone ? 'Tel: ' + orgInfo.phone : ''}${orgInfo.email ? (orgInfo.phone ? ' | ' : '') + orgInfo.email : ''}${orgInfo.website ? '<br>' + orgInfo.website : ''}${orgInfo.gstin ? '<br><b>GSTIN: ' + orgInfo.gstin + '</b>' : ''}
      </div>
    </div>
    <div>
      <div class="inv-title">Invoice</div>
      <div class="inv-meta"><strong>${invoice.id}</strong><br><span class="status status-${invoice.status}">${invoice.status}</span></div>
    </div>
  </div>
  <div class="addresses">
    <div class="addr-box">
      <div class="addr-label">Bill To</div>
      <div class="addr-name">${invoice.customer}</div>
      ${invoice.customerAddress ? '<div class="addr-line">' + invoice.customerAddress + '</div>' : ''}
      ${invoice.customerEmail ? '<div class="addr-line">' + invoice.customerEmail + '</div>' : ''}
      ${invoice.customerGSTIN ? '<div class="gstin">GSTIN: ' + invoice.customerGSTIN + '</div>' : ''}
    </div>
    <div class="addr-box">
      <div class="addr-label">From</div>
      <div class="addr-name">${company}</div>
      ${orgInfo.address ? '<div class="addr-line">' + orgInfo.address + '</div>' : ''}
      ${orgInfo.email ? '<div class="addr-line">' + orgInfo.email + '</div>' : ''}
      ${orgInfo.gstin ? '<div class="gstin">GSTIN: ' + orgInfo.gstin + '</div>' : ''}
    </div>
  </div>
  <div class="details">
    <div class="detail"><div class="detail-label">Invoice Date</div><div class="detail-value">${fmtDate(invoice.issueDate)}</div></div>
    <div class="detail"><div class="detail-label">Due Date</div><div class="detail-value">${fmtDate(invoice.dueDate)}</div></div>
    <div class="detail"><div class="detail-label">Terms</div><div class="detail-value">${invoice.paymentTerms || 'Net 30'}</div></div>
    <div class="detail"><div class="detail-label">Place of Supply</div><div class="detail-value">${invoice.placeOfSupply || '—'}</div></div>
  </div>
  <table>
    <thead><tr>
      <th style="width:36px;text-align:center;">#</th><th>Description</th>
      <th style="text-align:center;width:44px;">Qty</th><th style="text-align:right;width:80px;">Rate</th>
      <th style="text-align:center;width:50px;">Tax</th><th style="text-align:right;width:80px;">Tax Amt</th>
      <th style="text-align:right;width:90px;">Amount</th>
    </tr></thead>
    <tbody>${lineRows(lines, c)}</tbody>
  </table>
  <div class="totals"><div class="totals-box">
    <div class="tot-row"><span>Subtotal</span><span>${fmt(subtotal, c)}</span></div>
    ${tax > 0 ? '<div class="tot-row"><span>GST</span><span>' + fmt(tax, c) + '</span></div>' : ''}
    <div class="tot-row tot-grand"><span>Total Due</span><span>${fmt(grand, c)}</span></div>
  </div></div>
  ${
    invoice.notes || invoice.terms
      ? `<div class="section"><div class="section-grid">
    <div class="section-col">${invoice.notes ? '<div class="sec-label">Notes</div><div class="sec-text">' + invoice.notes + '</div>' : ''}</div>
    <div class="section-col">${invoice.terms ? '<div class="sec-label">Terms & Conditions</div><div class="sec-text">' + invoice.terms + '</div>' : ''}</div>
  </div></div>`
      : ''
  }
  <div class="footer">
    <div>Generated on ${fmtDate(new Date())}</div>
    <div><span class="footer-brand">${company}</span> &middot; Thank you for your business</div>
  </div>
</div></body></html>`;
}

// ── Template: Compact ──────────────────────────────────────────
function compactTemplate({ invoice, orgInfo }) {
  const lines = invoice.lineItems || [];
  const { subtotal, tax, grand } = calcTotals(lines);
  const c = orgInfo.currency || 'INR';
  const company = orgInfo.name || 'My Company';

  const compactRows = lines
    .map((l, i) => {
      const amt = l.qty * l.rate;
      const taxAmt = (amt * l.taxRate) / 100;
      return `<tr style="page-break-inside:avoid;">
      <td style="padding:6px 8px;font-size:12px;">${l.description}${l.hsn ? ' <span style="color:#9ca3af;font-size:10px;">(${l.hsn})</span>' : ''}</td>
      <td style="text-align:center;padding:6px 8px;font-size:12px;">${l.qty}</td>
      <td style="text-align:right;padding:6px 8px;font-size:12px;">${fmt(l.rate, c)}</td>
      <td style="text-align:right;padding:6px 8px;font-size:12px;">${fmt(amt + taxAmt, c)}</td>
    </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${invoice.id}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#111; font-size:12px; }
  @page { size:A4; margin:18mm 14mm; }
  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
  .page { max-width:760px; margin:0 auto; }
  table { width:100%; border-collapse:collapse; }
  thead { display:table-header-group; }
  th { font-size:10px; text-transform:uppercase; letter-spacing:0.5px; color:#666; padding:8px; border-bottom:2px solid #333; text-align:left; }
  td { border-bottom:1px solid #eee; }
</style></head><body>
<div class="page">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;">
    <div>
      <div style="font-size:20px;font-weight:700;">${company}</div>
      <div style="font-size:11px;color:#666;margin-top:4px;">${[orgInfo.address, orgInfo.phone, orgInfo.email].filter(Boolean).join(' | ')}</div>
      ${orgInfo.gstin ? '<div style="font-size:11px;color:#666;">GSTIN: ' + orgInfo.gstin + '</div>' : ''}
    </div>
    <div style="text-align:right;">
      <div style="font-size:24px;font-weight:800;letter-spacing:1px;">INVOICE</div>
      <div style="font-size:13px;font-weight:600;margin-top:2px;">${invoice.id}</div>
    </div>
  </div>
  <div style="display:flex;justify-content:space-between;margin-bottom:20px;padding:14px;background:#f9f9f9;border-radius:4px;">
    <div>
      <div style="font-size:9px;font-weight:700;text-transform:uppercase;color:#999;margin-bottom:4px;">Bill To</div>
      <div style="font-weight:600;">${invoice.customer}</div>
      ${invoice.customerAddress ? '<div style="font-size:11px;color:#666;">' + invoice.customerAddress + '</div>' : ''}
      ${invoice.customerGSTIN ? '<div style="font-size:10px;color:#666;font-family:monospace;">GSTIN: ' + invoice.customerGSTIN + '</div>' : ''}
    </div>
    <div style="text-align:right;font-size:12px;color:#444;line-height:1.8;">
      <div><b>Date:</b> ${fmtDateShort(invoice.issueDate)}</div>
      <div><b>Due:</b> ${fmtDateShort(invoice.dueDate)}</div>
      <div><b>Terms:</b> ${invoice.paymentTerms || 'Net 30'}</div>
      ${invoice.placeOfSupply ? '<div><b>Supply:</b> ' + invoice.placeOfSupply + '</div>' : ''}
    </div>
  </div>
  <table>
    <thead><tr>
      <th>Description</th><th style="text-align:center;width:50px;">Qty</th>
      <th style="text-align:right;width:80px;">Rate</th><th style="text-align:right;width:90px;">Amount</th>
    </tr></thead>
    <tbody>${compactRows}</tbody>
  </table>
  <div style="display:flex;justify-content:flex-end;margin-top:4px;">
    <div style="width:220px;">
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:12px;color:#666;"><span>Subtotal</span><span>${fmt(subtotal, c)}</span></div>
      ${tax > 0 ? '<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:12px;color:#666;border-top:1px solid #eee;"><span>Tax</span><span>' + fmt(tax, c) + '</span></div>' : ''}
      <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:15px;font-weight:700;border-top:2px solid #333;"><span>Total</span><span>${fmt(grand, c)}</span></div>
    </div>
  </div>
  ${invoice.notes ? '<div style="margin-top:20px;padding-top:14px;border-top:1px solid #eee;font-size:11px;color:#666;"><b>Notes:</b> ' + invoice.notes + '</div>' : ''}
  ${invoice.terms ? '<div style="margin-top:8px;font-size:11px;color:#999;"><b>Terms:</b> ' + invoice.terms + '</div>' : ''}
  <div style="margin-top:28px;padding-top:12px;border-top:1px solid #ddd;display:flex;justify-content:space-between;font-size:10px;color:#aaa;">
    <span>${company}</span><span>Generated ${fmtDateShort(new Date())}</span>
  </div>
</div></body></html>`;
}

// ── Template: GST Formal ───────────────────────────────────────
function gstFormalTemplate({ invoice, orgInfo }) {
  const lines = invoice.lineItems || [];
  const { subtotal, tax, grand } = calcTotals(lines);
  const c = orgInfo.currency || 'INR';
  const company = orgInfo.name || 'My Company';
  const halfTax = tax / 2;
  const isInterstate =
    invoice.placeOfSupply &&
    orgInfo.address &&
    !invoice.placeOfSupply.includes(orgInfo.address.split(',').pop()?.trim() || '___');

  const gstRows = lines
    .map((l, i) => {
      const amt = l.qty * l.rate;
      const taxAmt = (amt * l.taxRate) / 100;
      const halfRate = l.taxRate / 2;
      const halfAmt = taxAmt / 2;
      return `<tr style="page-break-inside:avoid;">
      <td style="text-align:center;padding:8px 6px;border:1px solid #ccc;">${i + 1}</td>
      <td style="padding:8px 6px;border:1px solid #ccc;">${l.description}</td>
      <td style="text-align:center;padding:8px 6px;border:1px solid #ccc;font-family:monospace;font-size:11px;">${l.hsn || '—'}</td>
      <td style="text-align:center;padding:8px 6px;border:1px solid #ccc;">${l.qty}</td>
      <td style="text-align:right;padding:8px 6px;border:1px solid #ccc;">${fmt(l.rate, c)}</td>
      <td style="text-align:right;padding:8px 6px;border:1px solid #ccc;">${fmt(amt, c)}</td>
      ${
        isInterstate
          ? `<td style="text-align:center;padding:8px 6px;border:1px solid #ccc;">${l.taxRate}%</td><td style="text-align:right;padding:8px 6px;border:1px solid #ccc;">${fmt(taxAmt, c)}</td>`
          : `<td style="text-align:center;padding:8px 6px;border:1px solid #ccc;">${halfRate}%</td><td style="text-align:right;padding:8px 6px;border:1px solid #ccc;">${fmt(halfAmt, c)}</td>
           <td style="text-align:center;padding:8px 6px;border:1px solid #ccc;">${halfRate}%</td><td style="text-align:right;padding:8px 6px;border:1px solid #ccc;">${fmt(halfAmt, c)}</td>`
      }
      <td style="text-align:right;padding:8px 6px;border:1px solid #ccc;font-weight:600;">${fmt(amt + taxAmt, c)}</td>
    </tr>`;
    })
    .join('');

  const taxCols = isInterstate
    ? '<th style="text-align:center;width:50px;">IGST %</th><th style="text-align:right;width:70px;">IGST Amt</th>'
    : '<th style="text-align:center;width:50px;">CGST %</th><th style="text-align:right;width:65px;">CGST Amt</th><th style="text-align:center;width:50px;">SGST %</th><th style="text-align:right;width:65px;">SGST Amt</th>';

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${invoice.id} - Tax Invoice</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color:#000; font-size:12px; }
  @page { size:A4; margin:15mm 12mm; }
  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
  .page { max-width:780px; margin:0 auto; border:2px solid #333; padding:0; }
  table { width:100%; border-collapse:collapse; }
  thead { display:table-header-group; }
  th { font-size:10px; font-weight:700; text-transform:uppercase; padding:8px 6px; border:1px solid #ccc; background:#f5f5f5; }
  .title-bar { background:#1a1a2e; color:#fff; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; }
  .title-bar h1 { font-size:16px; font-weight:700; letter-spacing:1px; }
  .info-grid { display:grid; grid-template-columns:1fr 1fr; }
  .info-cell { padding:12px 16px; border-bottom:1px solid #ddd; }
  .info-cell:first-child { border-right:1px solid #ddd; }
  .info-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#666; margin-bottom:4px; }
  .info-name { font-size:13px; font-weight:700; }
  .info-line { font-size:11px; color:#444; line-height:1.6; }
  .meta-row { display:flex; border-bottom:1px solid #ddd; }
  .meta-item { flex:1; padding:8px 16px; border-right:1px solid #ddd; }
  .meta-item:last-child { border-right:none; }
  .summary-row { display:flex; justify-content:space-between; padding:6px 16px; font-size:12px; }
  .summary-grand { background:#1a1a2e; color:#fff; font-weight:700; font-size:14px; padding:10px 16px; }
  .words-row { padding:10px 16px; background:#fffde7; border-top:1px solid #ddd; font-size:11px; }
  .sig-area { display:flex; justify-content:space-between; padding:24px 16px 16px; }
  .sig-box { text-align:center; }
  .sig-line { width:140px; border-top:1px solid #333; margin-top:40px; padding-top:4px; font-size:10px; color:#666; }
</style></head><body>
<div class="page">
  <div class="title-bar">
    <h1>TAX INVOICE</h1>
    <div style="font-size:12px;">${invoice.id}</div>
  </div>
  <div class="info-grid">
    <div class="info-cell">
      <div class="info-label">Supplier Details</div>
      <div class="info-name">${company}</div>
      ${orgInfo.address ? '<div class="info-line">' + orgInfo.address + '</div>' : ''}
      ${orgInfo.phone ? '<div class="info-line">Tel: ' + orgInfo.phone + '</div>' : ''}
      ${orgInfo.email ? '<div class="info-line">' + orgInfo.email + '</div>' : ''}
      ${orgInfo.gstin ? '<div class="info-line" style="font-weight:700;font-family:monospace;">GSTIN: ' + orgInfo.gstin + '</div>' : ''}
    </div>
    <div class="info-cell">
      <div class="info-label">Buyer Details</div>
      <div class="info-name">${invoice.customer}</div>
      ${invoice.customerAddress ? '<div class="info-line">' + invoice.customerAddress + '</div>' : ''}
      ${invoice.customerEmail ? '<div class="info-line">' + invoice.customerEmail + '</div>' : ''}
      ${invoice.customerGSTIN ? '<div class="info-line" style="font-weight:700;font-family:monospace;">GSTIN: ' + invoice.customerGSTIN + '</div>' : '<div class="info-line" style="color:#999;">GSTIN: Unregistered</div>'}
    </div>
  </div>
  <div class="meta-row">
    <div class="meta-item"><div class="info-label">Invoice Date</div><div style="font-weight:600;">${fmtDate(invoice.issueDate)}</div></div>
    <div class="meta-item"><div class="info-label">Due Date</div><div style="font-weight:600;">${fmtDate(invoice.dueDate)}</div></div>
    <div class="meta-item"><div class="info-label">Place of Supply</div><div style="font-weight:600;">${invoice.placeOfSupply || '—'}</div></div>
    <div class="meta-item"><div class="info-label">Reverse Charge</div><div style="font-weight:600;">No</div></div>
  </div>
  <table>
    <thead><tr>
      <th style="text-align:center;width:30px;">#</th>
      <th>Description of Goods/Services</th>
      <th style="text-align:center;width:60px;">HSN/SAC</th>
      <th style="text-align:center;width:40px;">Qty</th>
      <th style="text-align:right;width:70px;">Rate</th>
      <th style="text-align:right;width:75px;">Taxable Amt</th>
      ${taxCols}
      <th style="text-align:right;width:80px;">Total</th>
    </tr></thead>
    <tbody>${gstRows}</tbody>
  </table>
  <div style="display:flex;justify-content:flex-end;border-top:2px solid #333;">
    <div style="width:280px;border-left:1px solid #ddd;">
      <div class="summary-row" style="border-bottom:1px solid #eee;"><span>Taxable Amount</span><span>${fmt(subtotal, c)}</span></div>
      ${
        isInterstate
          ? '<div class="summary-row" style="border-bottom:1px solid #eee;"><span>IGST</span><span>' +
            fmt(tax, c) +
            '</span></div>'
          : '<div class="summary-row" style="border-bottom:1px solid #eee;"><span>CGST</span><span>' +
            fmt(halfTax, c) +
            '</span></div><div class="summary-row" style="border-bottom:1px solid #eee;"><span>SGST</span><span>' +
            fmt(halfTax, c) +
            '</span></div>'
      }
      <div class="summary-row summary-grand"><span>Grand Total</span><span>${fmt(grand, c)}</span></div>
    </div>
  </div>
  <div class="words-row"><strong>Amount in Words:</strong> ${numberToWords(grand)}</div>
  ${invoice.notes ? '<div style="padding:10px 16px;border-top:1px solid #ddd;font-size:11px;color:#444;"><b>Notes:</b> ' + invoice.notes + '</div>' : ''}
  ${invoice.terms ? '<div style="padding:10px 16px;border-top:1px solid #ddd;font-size:11px;color:#666;"><b>Terms & Conditions:</b> ' + invoice.terms + '</div>' : ''}
  <div class="sig-area">
    <div class="sig-box"><div class="sig-line">Receiver&rsquo;s Signature</div></div>
    <div class="sig-box"><div class="sig-line">For ${company}<br><span style="font-size:9px;">Authorised Signatory</span></div></div>
  </div>
</div></body></html>`;
}

// ── Template Registry ──────────────────────────────────────────
export const INVOICE_TEMPLATES = {
  standard: {
    id: 'standard',
    name: 'Standard',
    description: 'Clean, modern business invoice with indigo accent. Suitable for most businesses.',
    preview: 'Indigo header bar, card-style addresses, rounded totals box',
    render: standardTemplate,
  },
  compact: {
    id: 'compact',
    name: 'Compact',
    description: 'Minimal black-and-white layout. Fits more items per page.',
    preview: 'Monochrome, no background colors, dense line spacing',
    render: compactTemplate,
  },
  gst_formal: {
    id: 'gst_formal',
    name: 'GST Formal',
    description:
      'Government-style tax invoice with CGST/SGST split, HSN codes, amount in words, and signature lines.',
    preview: 'Bordered layout, CGST/SGST/IGST columns, reverse charge field, signatory area',
    render: gstFormalTemplate,
  },
};

export const DEFAULT_TEMPLATE_ID = 'standard';

export function getSelectedTemplateId() {
  if (typeof window === 'undefined') return DEFAULT_TEMPLATE_ID;
  return localStorage.getItem('nexora_invoice_template') || DEFAULT_TEMPLATE_ID;
}

export function setSelectedTemplateId(id) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('nexora_invoice_template', id);
}

export function renderInvoice(templateId, data) {
  const tpl = INVOICE_TEMPLATES[templateId] || INVOICE_TEMPLATES[DEFAULT_TEMPLATE_ID];
  return tpl.render(data);
}
