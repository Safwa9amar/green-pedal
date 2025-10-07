"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function BikeQRCode({ bikeId }: { bikeId: string }) {
  const [qrCode, setQrCode] = useState<string | null>(null);

  async function generateQRCode() {
    const qrData = `id=${bikeId}`;
    const qr = await QRCode.toDataURL(qrData, {
      margin: 2,
      width: 300,
    });
    setQrCode(qr);
  }

  useEffect(() => {
    generateQRCode();
  }, []);

  const handlePrint = () => {
    if (!qrCode) return;

    const printWindow = window.open("", "_blank", "width=400,height=400");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${qrCode}" alt="Bike QR Code" />
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() { window.close(); }
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <>
      {qrCode && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <img src={qrCode} alt="Bike QR Code" className="w-48 h-48" />
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Print QR Code
          </button>
        </div>
      )}
    </>
  );
}
