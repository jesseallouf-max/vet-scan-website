import { motion } from 'framer-motion'

// Comprehensive Abdominal Ultrasound Icon
const IconAbdominalScan = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 16v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M10 10h4M12 8v4" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

// Ultrasound-Guided Procedures Icon  
const IconGuidedProcedures = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 16v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M15 7l-6 6M15 13l-2-2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="9" cy="7" r="1" fill="currentColor"/>
    <circle cx="15" cy="13" r="1" fill="currentColor"/>
  </svg>
)

export default function Services() {
  return (
    <section id="services" className="section">
      <h2 className="text-3xl md:text-4xl font-semibold">VetScan NYC Services</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        
        {/* Comprehensive Abdominal Ultrasound */}
        <motion.div whileHover={{y:-2}}>
          <div className="card p-6 h-full">
            <div className="flex items-start gap-4">
              <div className="text-brand-primary"><IconAbdominalScan/></div>
              <div>
                <h3 className="text-xl font-semibold">Comprehensive Abdominal Ultrasound</h3>
                <p className="mt-2 text-gray-700">Complete evaluation of liver, gallbladder, pancreas, kidneys, spleen, bladder, and GI tract. Ideal for chronic disease workups, mass detection, and staging.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ultrasound-Guided Procedures */}
        <motion.div whileHover={{y:-2}}>
          <div className="card p-6 h-full">
            <div className="flex items-start gap-4">
              <div className="text-brand-primary"><IconGuidedProcedures/></div>
              <div>
                <h3 className="text-xl font-semibold">Ultrasound-Guided Procedures</h3>
                <p className="mt-2 text-gray-700">Fine-needle aspirations, cystocentesis, and therapeutic drainage procedures. Minimally invasive sampling with real-time ultrasound guidance for accurate diagnosis.</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
