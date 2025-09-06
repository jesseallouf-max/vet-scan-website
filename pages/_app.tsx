import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

export default function App({Component,pageProps}:AppProps){
  return (
    <>
      <Head>
        <title>VetScan NYC - Mobile Veterinary Ultrasound</title>
        <meta name="description" content="Expert mobile ultrasound services for veterinary clinics in Manhattan by Dr. Amelia Khan" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vetscannyc.com" />
        <meta property="og:title" content="VetScan NYC - Mobile Veterinary Ultrasound" />
        <meta property="og:description" content="Expert mobile ultrasound services for veterinary clinics in Manhattan by Dr. Amelia Khan" />
        <meta property="og:image" content="https://vetscannyc.com/images/og-image.jpg" />
        <meta property="og:site_name" content="VetScan NYC" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://vetscannyc.com" />
        <meta name="twitter:title" content="VetScan NYC - Mobile Veterinary Ultrasound" />
        <meta name="twitter:description" content="Expert mobile ultrasound services for veterinary clinics in Manhattan by Dr. Amelia Khan" />
        <meta name="twitter:image" content="https://vetscannyc.com/images/og-image.jpg" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps}/>
    </>
  )
}
