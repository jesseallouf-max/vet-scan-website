import Head from 'next/head'
import Header from '../components/Header'
import Hero from '../components/Hero'
import TrustBar from '../components/TrustBar'
import Services from '../components/Services'
import About from '../components/About'
import Coverage from '../components/Coverage'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'

export default function Home(){
  return (
    <>
      <Head>
        <title>Vet Scan NYC — Mobile Veterinary Ultrasound (Manhattan)</title>
        <meta name="description" content="Mobile veterinary ultrasound and teleconsults for hospitals in Manhattan. Abdominal scans, second opinions. 24—48 hour response." />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Status bar and theme color for mobile */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#146C60" />
        
        {/* Additional mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Coverage />
        <Testimonials />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}