// POLICY SETTINGS: change the numbers / details here and every policy page updates.
// IMPORTANT: replace these with your real business details and have the final text reviewed
// by a legal professional before publishing.
import { SITE } from './site'

export const POLICY = {
  businessName: SITE.name,
  email: SITE.email,
  phone: SITE.phone,
  supportHours: 'Monday to Saturday, 10:00 AM to 7:00 PM IST', // change to your real support hours
  updated: 'October 29, 2026',

  returnWindowDays: 7, // days after delivery to request a return / exchange
  damageReportHours: 48, // hours after delivery to report a damaged / wrong item
  refundDays: '5 to 7 business days', // time to refund after the returned item is approved
  cancelBeforeDispatch: true, // orders can be cancelled before they are dispatched
}

// Links shown in the side menu of every policy page
export const POLICY_LINKS = [
  { to: '/return-policy', label: 'Return Policy' },
  { to: '/refund-policy', label: 'Refund Policy' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/disclaimer', label: 'Disclaimer' },
    { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
]