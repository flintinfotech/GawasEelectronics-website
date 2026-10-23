import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import { StoreProvider } from './context'

function Top() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
export default function App() {
  return (
    <StoreProvider><BrowserRouter><Top /><Header />
      <main><Routes><Route path="/" element={<Home />} /><Route path="/product/:id" element={<ProductDetail />} /></Routes></main>
      <Footer /></BrowserRouter></StoreProvider>
  )
}
