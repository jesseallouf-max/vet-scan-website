import { useState } from 'react'
import { motion } from 'framer-motion'

function Item({q,a,isOpen,onToggle}:{q:string,a:string,isOpen:boolean,onToggle:()=>void}){
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button 
        onClick={onToggle} 
        className={`w-full text-left py-4 font-semibold text-lg transition-colors duration-200 flex items-center justify-between group focus:outline-none ${
          isOpen ? 'text-teal-700' : 'text-gray-900 md:hover:text-teal-700'
        }`}
      >
        <span>{q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-teal-600 group-hover:text-teal-700"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <p className="pb-4 text-gray-700 leading-relaxed">{a}</p>
      </motion.div>
    </div>
  )
}

export default function FAQ(){
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqItems = [
    {
      q: "Do you bring your own ultrasound equipment?", 
      a: "Professional equipment is provided, with the flexibility to use your existing ultrasound system when convenient."
    },
    {
      q: "How quickly can you schedule a visit?", 
      a: "I typically respond within 24-48 hours and work around your clinic's schedule. For urgent cases, same-day appointments may be available."
    },
    {
      q: "What areas of Manhattan do you cover?", 
      a: "I serve all of Manhattan south of 125th Street. For clinics outside this area, I'm happy to discuss special arrangements."
    },
    {
      q: "How long does a typical scan take?", 
      a: "Most abdominal scans take 20-30 minutes, depending on the case complexity and patient cooperation."
    },
    {
      q: "When will I receive the report?", 
      a: "Final results and comprehensive PDF reports with treatment and diagnostic recommendations are delivered immediately after each scan, before proceeding to the next case."
    },
    {
      q: "What if my patient is anxious or aggressive?", 
      a: "I'm experienced with anxious pets and work closely with your team to ensure patient comfort. Light sedation may be recommended for particularly stressed animals."
    }
  ]

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="section">
      <h2 className="text-3xl md:text-4xl font-semibold">Frequently Asked Questions</h2>
      <div className="mt-8 card p-6">
        {faqItems.map((item, index) => (
          <Item 
            key={index}
            q={item.q}
            a={item.a}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </section>
  )
}
