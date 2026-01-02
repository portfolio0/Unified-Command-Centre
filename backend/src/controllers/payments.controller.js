export const generateUpiLink = async (req, res) => {
  try {
    const { amount } = req.query;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Valid amount required" });
    }

    const upiId = "onkarnanvare9@oksbi"; // 🔴 replace with your UPI ID
    const name = "Unified Command Centre";
    const note = "Service Payment";

    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      name
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    res.json({ upiLink });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate UPI link" });
  }
};
