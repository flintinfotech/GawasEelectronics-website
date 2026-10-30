import { Link } from 'react-router-dom'
import PolicyLayout from '../components/PolicyLayout'
import { POLICY } from '../config/policies'

export default function RefundPolicy() {
  return (
    <PolicyLayout title="Refund Policy" intro="How and when you get your money back for returned or cancelled orders.">
      <h2>When you are eligible for a refund</h2>
      <ul>
        <li>Your return was approved under our <Link to="/return-policy">Return Policy</Link> and the product passed our quality check.</li>
        <li>You received a damaged, defective or wrong product and reported it in time.</li>
        {POLICY.cancelBeforeDispatch && <li>You cancelled your order <b>before it was dispatched</b>.</li>}
        <li>The product you ordered became unavailable and we could not ship it.</li>
      </ul>

      <h2>Refund timeline</h2>
      <p>After your returned product is received and approved, your refund is processed within <b>{POLICY.refundDays}</b>.</p>

      <table className="pl-table">
        <thead><tr><th>Payment method</th><th>How you are refunded</th></tr></thead>
        <tbody>
          <tr><td>Online payment (UPI, card, net banking, wallet)</td><td>To the original payment method. Your bank may take a few extra days to show it.</td></tr>
          <tr><td>Cash on Delivery</td><td>By bank transfer or UPI. We will ask you for your account or UPI details after your return is approved.</td></tr>
        </tbody>
      </table>

      <h2>What is refunded</h2>
      <ul>
        <li>The full product price for damaged, defective or wrong items, and for orders cancelled before dispatch.</li>
        <li>For other approved returns, the product price after any return shipping cost.</li>
        <li>Any discount or offer applied to your order is not refunded as cash. The refund is the amount you actually paid.</li>
      </ul>

      <h2>When a refund is not given</h2>
      <ul>
        <li>The return request was made after the return window.</li>
        <li>The product is used, damaged after delivery, or missing its original packaging.</li>
        <li>The product failed our quality check. We will tell you why and send it back if you wish.</li>
      </ul>

      <h2>Partial refunds</h2>
      <p>If only part of your order is returned, we refund only the returned items. If you bought during a "Buy 2 Get 15% Off" or "Buy 3 Get 20% Off" offer and return items so that your order no longer qualifies, the discount is recalculated and the refund is adjusted.</p>

      <h2>Didn't receive your refund?</h2>
      <p>First check your bank or payment app, then wait a few working days. If it still has not arrived, write to <a href={`mailto:${POLICY.email}`}>{POLICY.email}</a> with your order ID and we will check it for you.</p>
    </PolicyLayout>
  )
}