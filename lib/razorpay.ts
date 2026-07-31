/**
 * lib/razorpay.ts
 * Server-only Razorpay SDK initialisation.
 * RAZORPAY_KEY_SECRET must NEVER be referenced in client-side code.
 */
import Razorpay from "razorpay";

const keyId     = process.env.RAZORPAY_KEY_ID     || "rzp_test_placeholder";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn(
    "[razorpay] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set. Payment features will be unavailable."
  );
}

export const razorpay = new Razorpay({
  key_id:     keyId,
  key_secret: keySecret,
});
