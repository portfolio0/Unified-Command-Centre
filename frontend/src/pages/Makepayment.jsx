import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function MakePayment() {
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [upiUrl, setUpiUrl] = useState("");

  const generateQR = () => {
    const url = `upi://pay?pa=${upiId}&pn=WebsiteUser&am=${amount}&cu=INR&tn=Website Payment`;
    setUpiUrl(url);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>UPI QR Payment</h2>

      <input
        placeholder="Enter UPI ID"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
      />
      <br />
      <br />

      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <br />
      <br />

      <button onClick={generateQR}>Generate QR</button>

      {upiUrl && (
        <>
          <br />
          <br />
          <QRCodeCanvas value={upiUrl} size={220} />
          <p>Scan with any UPI App</p>

          {/* Mobile users */}
          <a href={upiUrl}>Pay Now</a>
        </>
      )}
    </div>
  );
}
