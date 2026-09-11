import { jsPDF } from 'jspdf';
import { Order } from '../types';

/**
 * Normalizes text for standard PDF fonts (ensures crisp rendering without encoding glitches)
 */
function sanitizePdfText(str: string): string {
  if (!str) return '';
  return str
    .replace(/ə/g, 'e')
    .replace(/Ə/g, 'E')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'I')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'G')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 'S')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'C')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'O')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'U')
    .replace(/₼/g, 'AZN');
}

export function generateInvoicePdf(order: Order, autoDownload: boolean = true): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const primaryBlue = [30, 64, 175]; // #1e40af
  const darkNavy = [15, 23, 42];     // #0f172a
  const slateGray = [100, 116, 139]; // #64748b
  const lightBg = [241, 245, 249];   // #f1f5f9

  // Top Header Background Ribbon
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Brand Name & Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('MAVI BOUTIQUE', 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Eksklyuziv Geyim Magazasi | www.mavi.az', 14, 20);

  // Document Title on Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('SIFARIS QAIMESI (INVOICE)', pageWidth - 14, 13, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Qaime No: ${order.orderNumber}`, pageWidth - 14, 20, { align: 'right' });

  // Invoice & Customer Info Box
  let y = 38;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 38, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pageWidth - 28, 38, 3, 3, 'S');

  // Left column: Customer Details
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('MUSTERI MELUMATLARI:', 20, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Ad, Soyad: ${sanitizePdfText(order.shippingAddress.fullName)}`, 20, y + 15);
  doc.text(`Elaqe Tel: ${sanitizePdfText(order.shippingAddress.phone)}`, 20, y + 21);
  doc.text(`E-poct: ${order.userEmail}`, 20, y + 27);
  doc.text(`Unvan: ${sanitizePdfText(order.shippingAddress.city)}, ${sanitizePdfText(order.shippingAddress.address)}`, 20, y + 33);

  // Right column: Order Info
  const rightColX = pageWidth / 2 + 10;
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('SIFARIS REKVIZITLERI:', rightColX, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Tarix: ${sanitizePdfText(order.createdAt)}`, rightColX, y + 15);
  doc.text(
    `Odenis Usulu: ${order.paymentMethod === 'card' ? 'Bank Karti (Online)' : 'Qapida Nagd / Posterminal'}`,
    rightColX,
    y + 21
  );
  doc.text(
    `Sifaris Statusu: ${
      order.status === 'pending'
        ? 'Qebul Edildi (Gozlemede)'
        : order.status === 'processing'
        ? 'Hazirlanir'
        : order.status === 'shipped'
        ? 'Kuryerde'
        : 'Catdirildi'
    }`,
    rightColX,
    y + 27
  );
  if (order.shippingAddress.notes) {
    doc.text(`Qeyd: ${sanitizePdfText(order.shippingAddress.notes).substring(0, 35)}`, rightColX, y + 33);
  }

  // Items Table Header
  y = 86;
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(14, y, pageWidth - 28, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('#', 18, y + 5.5);
  doc.text('MEHSULUN ADI VE PARAMETRLERI', 28, y + 5.5);
  doc.text('OLCU / RENG', 110, y + 5.5);
  doc.text('QIYMET', 142, y + 5.5, { align: 'right' });
  doc.text('SAY', 160, y + 5.5, { align: 'center' });
  doc.text('MEBLEG', pageWidth - 18, y + 5.5, { align: 'right' });

  // Items Rows
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  order.items.forEach((item, index) => {
    const rowBg = index % 2 === 0 ? [255, 255, 255] : lightBg;
    doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
    doc.rect(14, y, pageWidth - 28, 9, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(14, y + 9, pageWidth - 14, y + 9);

    doc.setTextColor(51, 65, 85);
    doc.text(`${index + 1}`, 18, y + 6);
    
    // Product Name
    const cleanName = sanitizePdfText(item.product.name);
    doc.text(cleanName.length > 40 ? cleanName.substring(0, 38) + '...' : cleanName, 28, y + 6);

    // Size and Color
    const cleanVariant = `${item.selectedSize} / ${sanitizePdfText(item.selectedColor.name)}`;
    doc.text(cleanVariant, 110, y + 6);

    // Unit Price
    doc.text(`${item.product.price.toFixed(2)} AZN`, 142, y + 6, { align: 'right' });

    // Quantity
    doc.text(`${item.quantity}`, 160, y + 6, { align: 'center' });

    // Row Total
    const rowTotal = item.product.price * item.quantity;
    doc.setFont('helvetica', 'bold');
    doc.text(`${rowTotal.toFixed(2)} AZN`, pageWidth - 18, y + 6, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    y += 9;
  });

  // Summary Box (Totals)
  y += 4;
  const summaryBoxWidth = 80;
  const summaryX = pageWidth - 14 - summaryBoxWidth;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(summaryX, y, summaryBoxWidth, 34, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(summaryX, y, summaryBoxWidth, 34, 2, 2, 'S');

  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  // Subtotal
  doc.text('Ara Cem:', summaryX + 6, y + 7);
  doc.text(`${order.subtotal.toFixed(2)} AZN`, summaryX + summaryBoxWidth - 6, y + 7, { align: 'right' });

  // Discount
  if (order.discount > 0) {
    doc.setTextColor(22, 163, 74);
    doc.text('Endirim (MAVI10):', summaryX + 6, y + 13);
    doc.text(`-${order.discount.toFixed(2)} AZN`, summaryX + summaryBoxWidth - 6, y + 13, { align: 'right' });
    doc.setTextColor(71, 85, 105);
  } else {
    doc.text('Endirim:', summaryX + 6, y + 13);
    doc.text('0.00 AZN', summaryX + summaryBoxWidth - 6, y + 13, { align: 'right' });
  }

  // Shipping
  doc.text('Catdirilma:', summaryX + 6, y + 19);
  doc.text(
    order.shippingFee === 0 ? 'PULSUZ (0.00 AZN)' : `${order.shippingFee.toFixed(2)} AZN`,
    summaryX + summaryBoxWidth - 6,
    y + 19,
    { align: 'right' }
  );

  // Line
  doc.setDrawColor(203, 213, 225);
  doc.line(summaryX + 4, y + 23, summaryX + summaryBoxWidth - 4, y + 23);

  // Grand Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 64, 175);
  doc.text('Yekun Mebleg:', summaryX + 6, y + 29);
  doc.text(`${order.total.toFixed(2)} AZN`, summaryX + summaryBoxWidth - 6, y + 29, { align: 'right' });

  // Official Stamp & Guarantee Note
  const stampY = y + 2;
  doc.setDrawColor(30, 64, 175);
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(14, stampY, 85, 30, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 64, 175);
  doc.text('RESMI ZEMANET VE ELEKTRON QAIME', 18, stampY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Bu qaime elektron qaydada tertib olunmusdur.', 18, stampY + 13);
  doc.text('14 gun erzinde etiket saxlanilmaqla deyisdirilme temin edilir.', 18, stampY + 18);
  doc.text('Musteri Xidmeti: +994 12 555 20 26 | info@mavi.az', 18, stampY + 23);

  // Footer
  const footerY = 282;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, footerY - 4, pageWidth - 14, footerY - 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('MAVI.AZ BOUTIQUE - Baki seheri, Nizami kucesi 100 | VOEN: 1402894121', 14, footerY);
  doc.text(`Yaradilma tarixi: ${new Date().toLocaleDateString('az-AZ')}`, pageWidth - 14, footerY, {
    align: 'right',
  });

  if (autoDownload) {
    doc.save(`Mavi_Boutique_Qaime_${order.orderNumber}.pdf`);
  }

  return doc;
}
