import Logo from './Logo'
import { DEVICES, SITE } from '../data/products'
export default function Footer() {
  return (
    <footer className="footer">
      <section className="join"><h2>Join Our List</h2><p>New arrivals, collabs and once-in-a-lifetime deals.</p>
        <form onSubmit={e => { e.preventDefault(); alert('Subscribed!') }}><input type="email" required placeholder="Enter your email" /><button>Subscribe</button></form></section>
      <div className="container fgrid">
        <div><Logo light /><p className="muted">{SITE.tagline}. Designed in India for real life.</p><p className="muted">{SITE.email}<br />{SITE.phone}</p></div>
        <div><h4>Company</h4>{['About Us', 'Contact Us', 'Our Blogs', 'Privacy Policy', 'Terms of Service'].map(l => <a key={l} href="#">{l}</a>)}</div>
        <div><h4>Need Help?</h4>{['Track Order', "FAQ's", 'Return & Exchange', 'Cancellation', 'Shipping Information'].map(l => <a key={l} href="#">{l}</a>)}</div>
        <div><h4>Latest Models</h4>{DEVICES.map(l => <a key={l} href="#">{l}</a>)}</div>
      </div>
      <div className="container copy">© 2026 Gawas Electronics. All rights reserved.</div>
    </footer>
  )
}
