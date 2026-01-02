import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function MakePayment() {
  const [upiId, setUpiId] = useState("onkar@oksbi");
  const [amount, setAmount] = useState("");
  // const [upiUrl, setUpiUrl] = useState("");

  // const generateQR = () => {
  //   if (!upiId || !amount) return;
  //   const url = `upi://pay?pa=${upiId}&pn=WebsiteUser&am=${amount}&cu=INR&tn=Website Payment`;
  //   setUpiUrl(url);
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          UPI QR Payment
        </h2>

        {/* UPI ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            UPI ID
          </label>
          <input
            type="text"
            placeholder="example@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled
          />
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            placeholder="100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled
          />
        </div>

        {/* Generate Button */}
        {/* <button
          onClick={generateQR}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Generate QR Code
        </button> */}
        <button
          onClick={() => {
            window.location.href = "upi://";
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer"
        >
          Pay via UPI
        </button>

        {/* QR Section */}
        {/* {upiUrl && (
          <div className="mt-6 text-center">
            <QRCodeCanvas value={upiUrl} size={220} />
            <p className="text-sm text-gray-600 mt-3">
              Scan using Google Pay / PhonePe / Paytm
            </p>

            <a
              href={upiUrl}
              className="inline-block mt-4 text-indigo-600 font-medium hover:underline"
            >
              Pay Now (Mobile Users)
            </a>
          </div>
        )} */}
      </div>
    </div>
  );
}
