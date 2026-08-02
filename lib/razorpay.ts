/**
 * lib/razorpay.ts
 * Server-only Razorpay SDK initialisation.
 * RAZORPAY_KEY_SECRET must NEVER be referenced in client-side code.
 */
import Razorpay from "razorpay";

const keyId     = process.env.RAZORPAY_KEY_ID     ?? "";
const keySecret = process.env.RAZORPAY_KEY_SECRET ?? "";

if (!keyId || !keySecret) {
  console.warn(
    "[razorpay] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set. Payment features will be unavailable."
  );
}

// Return a dummy client stub during build-time module evaluation to prevent crashes
export const razorpay = keyId && keySecret
  ? new Razorpay({
      key_id:     keyId,
      key_secret: keySecret,
    })
  : new Proxy({}, {
      get: () => () => new Proxy({}, {
        get: () => () => Promise.resolve({ id: "dummy_rzp_order_id" })
      })
    }) as any;
