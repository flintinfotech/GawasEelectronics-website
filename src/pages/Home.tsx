import Banner from '../components/Banner'
import ProductGrid from '../components/Product'
import ProductSlider from '../components/ProductSlider'
import Perks from '../components/Perks'
import Lifestyle from '../components/Lifestyle'

// Home page: sections ka order yahi se badlo
export default function Home() {
  return (
    <>
      <Banner section="top" />
      <ProductSlider />
      <Banner section="middle" />
      <ProductGrid />
      <Perks />
      <Lifestyle />
      <Banner section="bottom" />
    </>
  )
}