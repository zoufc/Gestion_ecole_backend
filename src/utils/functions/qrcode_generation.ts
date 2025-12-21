/* eslint-disable prettier/prettier */
const QRCode = require('qrcode');

export async function generateQRCode(data: any): Promise<string> {
  try {
    const jsonData = JSON.stringify(data);
    const qrCodeDataUrl = await QRCode.toDataURL(jsonData, {
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
}

