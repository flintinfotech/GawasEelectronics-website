import { Link } from 'react-router-dom'
import PolicyLayout from '../components/PolicyLayout'
import { POLICY } from '../config/policies'

export default function Disclaimer() {
  return (
    <PolicyLayout title="Disclaimer" intro={`Please read this before you buy from ${POLICY.businessName}.`}>
      <h2>Product protection</h2>
      <p>Our cases are designed to help protect your phone from everyday bumps and scratches. No case can fully protect a phone from every fall, impact, liquid or pressure. We are not responsible for damage to your phone while it is in one of our cases.</p>

      <h2>Compatibility</h2>
      <p>Please check your exact phone model before you order. Phones of the same brand can look similar but have different sizes and camera layouts. We are not responsible for orders placed for the wrong model. See our <Link to="/return-policy">Return Policy</Link> for what we can do to help.</p>

      <h2>Colours and images</h2>
      <p>We try to show our products as accurately as possible. Colours, finish and design may look slightly different on your screen or in real life because of lighting and display settings. Small differences are not considered defects.</p>

      <h2>Brands and trademarks</h2>
      <p>iPhone, Galaxy, OnePlus, Pixel and other product names are trademarks of their respective owners. {POLICY.businessName} is an independent seller. We are <b>not affiliated with, endorsed by or sponsored by</b> these brands. Their names are used only to say which phone our cases fit.</p>

      <h2>Prices and availability</h2>
      <p>Prices, offers and stock can change without notice. If we find a pricing or listing error, we may cancel the affected order and refund any amount paid.</p>

      <h2>Accuracy of information</h2>
      <p>We work to keep the information on this website correct and up to date, but we do not guarantee that it is always complete, accurate or error free.</p>

      <h2>Third-party links</h2>
      <p>Links to other websites are given for your convenience. We do not control those websites and are not responsible for their content or services.</p>

      <h2>Limitation of liability</h2>
      <p>To the fullest extent allowed by law, {POLICY.businessName} will not be liable for any indirect or consequential loss arising from the use of this website or our products. Our total liability for any order will not exceed the amount you paid for that order.</p>

      <h2>Questions?</h2>
      <p>Contact us at <a href={`mailto:${POLICY.email}`}>{POLICY.email}</a>.</p>
    </PolicyLayout>
  )
}