import { motion } from 'framer-motion'
const IconScan=()=>(<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 16v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2" stroke="currentColor" strokeWidth="1.5"/></svg>)
const IconConsult=()=>(<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4 5h16v10H7l-3 3V5z" stroke="currentColor" strokeWidth="1.5"/><path d="M8 9h8M8 12h6" stroke="currentColor" strokeWidth="1.5"/></svg>)
export default function Services(){
  return (
    <section id="services" className="section">
      <h2 className="text-3xl md:text-4xl font-semibold">Services</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <motion.div whileHover={{y:-2}} className="card p-6">
          <div className="flex items-start gap-4">
            <div className="text-brand-primary"><IconScan/></div>
            <div>
              <h3 className="text-xl font-semibold">Abdominal Ultrasound</h3>
              <p className="mt-2 text-gray-700">Vomiting, masses, staging, chronic disease workups. Performed using your in-hospital ultrasound equipment.</p>
            </div>
          </div>
        </motion.div>
        <motion.div whileHover={{y:-2}} className="card p-6">
          <div className="flex items-start gap-4">
            <div className="text-brand-primary"><IconConsult/></div>
            <div>
              <h3 className="text-xl font-semibold">Second Opinions</h3>
              <p className="mt-2 text-gray-700">Diagnostic review and case consultation for clinics seeking a second set of eyes.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
