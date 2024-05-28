import React from 'react'
import Navbar from '../UI_Components/Navbar'
import Hero from './Hero'
import ProductFeaturesShowcase from './ProductFeaturesShowcase'
import FAQ_And_Footer from './FAQ_And_Footer'

const LandingPageIndex = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <ProductFeaturesShowcase />
      <FAQ_And_Footer />
    </div>
  )
}

export default LandingPageIndex