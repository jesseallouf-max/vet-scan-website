import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="section pt-6 md:pt-10 pb-6 md:pb-10" aria-labelledby="hero-heading">
      <div className="md:grid md:grid-cols-2 md:items-center md:gap-10">
        
        {/* Mobile Image - now visible on mobile, placed first */}
        <div className="md:hidden mb-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.22, delay: 0.05 }}
          >
          <div className="relative w-full h-[280px] rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 bg-white">
            <Image
              src="/images/headshot.jpg"
              alt="Dr. Amelia Khan with a canine patient in a Manhattan clinic exam room."
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
                          </motion.div>
        </div>
        </div>
        </div>

        {/* Desktop Image - hidden on mobile, shown on desktop */}
        <div className="hidden md:block order-1">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.22, delay: 0.05 }}
          >
          <div className="relative w-full h-[420px] rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 bg-white">
            <Image
              src="/images/headshot.jpg"
              alt="Dr. Amelia Khan with a canine patient in a Manhattan clinic exam room."
              fill
              priority
              sizes="(min-width: 768px) 520px, 100vw"
              className="object-cover object-center"
            />
          </div>
        </motion.div>

        {/* Copy column - now with professional, straightforward copy */}
        <div className="order-2">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
          >
          <h1
            id="hero-heading"
            className="max-w-2xl text-4xl sm:text-5xl md:text-6xl leading-none tracking-tight text-left"
          >
            <strong 
              className="text-teal-700" 
              style={{ 
                backgroundColor: 'rgba(244,238,226, 0.4)',
                fontWeight: 900,
                WebkitFontSmoothing: 'antialiased',
                padding: '8px 8px 12px 8px',
                borderRadius: '6px',
                boxDecorationBreak: 'clone',
                WebkitBoxDecorationBreak: 'clone',
                marginBottom: '12px',
                display: 'inline-block'
              }}
            >
              Professional Ultrasound
            </strong>
            <br />
            <span className="text-gray-900" style={{ fontWeight: 400 }}>
              Services for Veterinary Clinics
            </span>
          </h1>

          <p className="mt-6 md:mt-8 text-xl md:text-2xl font-semibold text-teal-700 leading-tight text-left" style={{ marginLeft: '8px' }}>
            Board-certified expertise at your facility
          </p>
         
          {/* Primary CTA - Fixed sizing issues */}
          <div className="mt-8 md:mt-10 flex justify-center md:justify-start" style={{ marginLeft: '8px' }}>
            <a
              href="#contact"
              aria-label="Request a scan"
              data-event="hero_request_scan"
              className="btn-hero-professional"
            >
              SCHEDULE SERVICE
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
