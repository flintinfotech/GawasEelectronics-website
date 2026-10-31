import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import { AuthProvider } from './context/AuthContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import Search from './pages/Search'
import Login from './pages/Login'
import Register from './pages/Register'
import ReturnPolicy from './pages/ReturnPolicy'
import RefundPolicy from './pages/RefundPolicy'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Disclaimer from './pages/Disclaimer'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import MyAccount from './pages/MyAccount'
import MyOrders from './pages/MyOrders'
import EditProfile from './pages/EditProfile'
import ProtectedRoute from './components/ProtectedRoute'

// Scroll to top on page change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Any unknown URL
function NotFound() {
  return (
    <section className="container section" style={{ textAlign: 'center' }}>
      <h1 className="h2">Page not found</h1>
      <p className="sub">The page you are looking for does not exist.</p>
      <Link to="/" className="btn dark">Go to Home</Link>
    </section>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              {/* Customer-only pages (not logged in -> /login) */}
              <Route path="/my-account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
              <Route path="/my-wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
              <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </StoreProvider>
    </AuthProvider>
  )
}