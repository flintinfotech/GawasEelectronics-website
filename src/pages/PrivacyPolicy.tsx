import { Link } from 'react-router-dom'
import PolicyLayout from '../components/PolicyLayout'
import { POLICY } from '../config/policies'

export default function PrivacyPolicy() {
  return (
    <PolicyLayout title="Privacy Policy" intro={`${POLICY.businessName} respects your privacy. This page explains what information we collect, why we collect it and how we protect it.`}>
      <h2>Information we collect</h2>
      <ul>
        <li><b>Account details:</b> your name, email address, phone number and password when you register.</li>
        <li><b>Order details:</b> delivery address, city, pincode and the products you order.</li>
        <li><b>Messages:</b> anything you send us through the contact form, email or phone.</li>
        <li><b>Technical data:</b> basic information such as browser type and pages visited, to keep the website working properly.</li>
        <li><b>Saved on your device:</b> your cart, wishlist and login session are saved in your browser so they are still there when you come back.</li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To create and manage your account.</li>
        <li>To process, deliver and support your orders, returns and refunds.</li>
        <li>To contact you about your order or answer your questions.</li>
        <li>To send offers and new arrivals, only if you subscribed. You can unsubscribe at any time.</li>
        <li>To improve our website, products and service, and to prevent fraud or misuse.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>We do not sell your personal information. We share it only with people who help us serve you, and only what they need:</p>
      <ul>
        <li>Courier and logistics partners, to deliver your order.</li>
        <li>Payment providers, when online payment is available.</li>
        <li>Technology and hosting providers that run our website.</li>
        <li>Authorities, when the law requires it.</li>
      </ul>

      <h2>Cookies and local storage</h2>
      <p>We use browser storage and similar technology to remember your cart, wishlist and login. You can clear this at any time from your browser settings, but your cart and login may be lost.</p>

      <h2>How long we keep your data</h2>
      <p>We keep your information for as long as your account is active or as needed to provide our service, handle returns and meet legal, tax and accounting duties. After that, we delete or anonymise it.</p>

      <h2>Keeping your data safe</h2>
      <p>We use reasonable technical and organisational measures to protect your information. No website can promise complete security, so please choose a strong password and do not share it.</p>

      <h2>Your rights</h2>
      <p>You can ask us to show you the information we hold about you, correct it, or delete it, and you can withdraw your consent for marketing messages. Write to <a href={`mailto:${POLICY.email}`}>{POLICY.email}</a> and we will respond within a reasonable time, in line with applicable Indian law, including the Digital Personal Data Protection Act, 2023.</p>

      <h2>Children</h2>
      <p>Our website is meant for adults. We do not knowingly collect information from children under 18 without a parent or guardian's consent.</p>

      <h2>Links to other websites</h2>
      <p>Our site may link to other websites. We are not responsible for their privacy practices, so please read their policies.</p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy from time to time. The "Last updated" date at the top shows the latest version.</p>

      <h2>Contact us</h2>
      <p>Questions about privacy? Email <a href={`mailto:${POLICY.email}`}>{POLICY.email}</a>, call {POLICY.phone}, or use our <Link to="/contact">Contact page</Link>.</p>
    </PolicyLayout>
  )
}