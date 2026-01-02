import { useState } from "react";
import { api } from "../services/api";
import { QRCodeSVG } from "qrcode.react";

export default function Makepayment() {
  const [amount, setAmount] = useState("");
  const [upiLink, setUpiLink] = useState("");

  const generateQr = async () => {
    if (!amount || isNaN(amount)) {
      alert("Enter valid amount");
      return;
    }

    try {
      const res = await api.get(`/payments/upi?amount=${amount}`);
      setUpiLink(res.data.upiLink);
    } catch (err) {
      console.error(err);
      alert("Failed to generate QR");
    }
  };

  const openUpiApp = () => {
    window.location.href = upiLink;
    alert("Currently Working On Only Mobile Phones");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">UPI Payment</h1>

      <div className="bg-white shadow rounded p-4 space-y-4">
        <input
          type="number"
          placeholder="Enter Amount (₹)"
          className="border p-2 w-full rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={generateQr}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full cursor-pointer"
        >
          Generate QR Code
        </button>

        {upiLink && (
          <div className="text-center mt-4 flex items-center justify-center flex-col space-y-3">
            <QRCodeSVG value={upiLink} size={220} />
            <p className="text-sm text-gray-600">Scan using any UPI app</p>

            <button
              onClick={openUpiApp}
              className="bg-green-600 text-white px-4 py-2 rounded w-full cursor-pointer"
            >
              Open UPI App
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        ⚠ Payment confirmation is manual. No payment gateway used.
      </p>
    </div>
  );
}
