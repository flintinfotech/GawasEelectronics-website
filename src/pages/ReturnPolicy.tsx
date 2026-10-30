import { Link } from 'react-router-dom'
import PolicyLayout from '../components/PolicyLayout'
import { POLICY } from '../config/policies'

export default function ReturnPolicy() {
  return (
    <PolicyLayout title="Return & Exchange Policy" intro={`We want you to love your ${POLICY.businessName} case. If something is not right, here is how returns and exchanges work.`}>
      <h2>Return window</h2>
      <p>You can request a return or exchange within <b>{POLICY.returnWindowDays} days of delivery</b>. Requests made after this period cannot be accepted.</p>

      <h2>What can be returned</h2>
      <ul>
        <li>Products that are unused, unscratched and in their original condition and packaging.</li>
        <li>Products that arrived <b>damaged, defective or different</b> from what you ordered.</li>
        <li>Products that do not fit your phone because the wrong model was shipped by us.</li>
      </ul>

      <h2>What cannot be returned</h2>
      <ul>
        <li>Cases that have been used, fitted on a phone, scratched, stained or damaged after delivery.</li>
        <li>Products without the original packaging, tags or accessories.</li>
        <li>Customised or personalised products.</li>
        <li>Products ordered for the wrong phone model by mistake. Please check your model before ordering. We will still try to help with an exchange where stock allows.</li>
        <li>Items marked "Final Sale" or "Non-returnable" on the product page.</li>
      </ul>

      <div className="pl-note warn">
        <b>Damaged or wrong item?</b> Please tell us within <b>{POLICY.damageReportHours} hours of delivery</b> and share clear photos. An unboxing video helps us resolve your case faster.
      </div>

      <h2>How to request a return or exchange</h2>
      <ol>
        <li>Email <a href={`mailto:${POLICY.email}`}>{POLICY.email}</a> or call {POLICY.phone} ({POLICY.supportHours}).</li>
        <li>Share your <b>order ID</b>, the product name, the reason, and photos if the item is damaged or wrong.</li>
        <li>Once we approve your request, we will arrange a pickup or tell you where to send the product.</li>
        <li>After the product reaches us and passes a quality check, we will send the replacement or process your refund.</li>
      </ol>

      <h2>Exchanges</h2>
      <p>You can exchange a product for another model, design or colour, subject to stock. If the new product costs more, you pay the difference. If it costs less, we refund the difference as described in our <Link to="/refund-policy">Refund Policy</Link>.</p>

      <h2>Shipping costs</h2>
      <p>Return shipping is free if we sent a damaged, defective or wrong product. For other approved returns, the return shipping cost may be deducted from your refund.</p>

      <h2>Need help?</h2>
      <p>Write to us at <a href={`mailto:${POLICY.email}`}>{POLICY.email}</a> or visit our <Link to="/contact">Contact page</Link>.</p>
    </PolicyLayout>
  )
}