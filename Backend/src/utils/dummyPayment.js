const VALID_TEST_CARDS = [
  "4111111111111111",
  "5500000000000004",
  "4000000000000002"
];

const DECLINE_CARD = "4000000000000002";

const processDummyPayment = (method, details = {}) => {

  // UPI
  if (method === "upi") {
    if (!details.vpa || !details.vpa.includes("@")) {
      return { success: false, reason: "Invalid VPA" };
    }

    if (Math.random() < 0.1) {
      return { success: false, reason: "UPI timeout" };
    }

    return { success: true };
  }

  // CARD
  if (method === "card") {
    const clean = (details.cardNumber || "").replace(/\s/g, "");

    if (clean.length !== 16 || isNaN(clean)) {
      return { success: false, reason: "Invalid card number" };
    }

    if (clean === DECLINE_CARD) {
      return { success: false, reason: "Card declined" };
    }

    if (!VALID_TEST_CARDS.includes(clean)) {
      return { success: false, reason: "Use test card" };
    }

    return { success: true };
  }

  // NETBANKING
  if (method === "netbanking") {
    const banks = ["SBI", "HDFC", "ICICI", "AXIS"];

    if (!banks.includes(details.bankCode)) {
      return { success: false, reason: "Invalid bank" };
    }

    return { success: true };
  }

  return { success: false, reason: "Invalid payment method" };
};

module.exports = processDummyPayment;