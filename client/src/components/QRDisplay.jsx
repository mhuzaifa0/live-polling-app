import { QRCodeSVG } from "qrcode.react";

export default function QRDisplay({ url }) {
  return (
    <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow">
      <QRCodeSVG value={url} size={140} />
      <span className="text-xs text-gray-500 break-all text-center">{url}</span>
    </div>
  );
}
