import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="section pt-6 md:pt-10 pb-6 md:pb-10" aria-labelledby="hero-heading">
      <div className="md:grid md:grid-cols-2 md:items-center md:gap-10">
        
        {/* Mobile Image - back to top position */}
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
                className="object-cover object-top"
              />
            </div>
          </motion.div>
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
                className="object-cover object-top"
              />
            </div>
          </motion.div>
        </div>

        {/* Copy column - now below mobile image */}
        <div className="order-2">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
          >
            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight tracking-tight text-left mb-4"
            >
              <strong 
                className="text-teal-700" 
                style={{ 
                  backgroundColor: 'rgba(244,238,226, 0.4)',
                  fontWeight: 900,
                  WebkitFontSmoothing: 'antialiased',
                  padding: '4px 8px 6px 8px',
                  borderRadius: '6px',
                  boxDecorationBreak: 'clone',
                  WebkitBoxDecorationBreak: 'clone',
                  marginBottom: '2px',
                  display: 'inline-block'
                }}
              >
                Mobile Ultrasound Service
              </strong>
            </h1>
           
            {/* Primary CTA - Using correct class and full width */}
            <div className="mt-6 md:mt-8 flex justify-center md:justify-start" style={{ marginLeft: '8px' }}>
              <a
                href="#contact"
                aria-label="Request a scan"
                data-event="hero_request_scan"
                className="btn-hero-responsive"
              >
                BOOK NOW
              </a>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
