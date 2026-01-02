// import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function MakePayment() {
  // const [upiId, setUpiId] = useState("onkar@oksbi");
  // const [amount, setAmount] = useState("");
  // const [upiUrl, setUpiUrl] = useState("");

  // const generateQR = () => {
  //   if (!upiId || !amount) return;
  //   const url = `upi://pay?pa=${upiId}&pn=WebsiteUser&am=${amount}&cu=INR&tn=Website Payment`;
  //   setUpiUrl(url);
  // };

  const openUpiApp = () => {
    // This opens the UPI app chooser or default UPI app
    window.location.href = "upi://";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 text-center">
        <h1 className="text-2xl font-semibold mb-4">Pay via UPI</h1>

        <p className="text-gray-600 mb-6">
          Click the button below to open your UPI app. You can enter the amount
          and pay manually.
        </p>

        <button
          onClick={openUpiApp}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Open UPI App
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Works on Android devices with UPI apps installed.
        </p>
      </div>
    </div>
  );
}
