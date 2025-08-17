import { motion } from 'framer-motion'

export default function Testimonials(){
  return (
    <section id="testimonials" className="section">
      <h2 className="text-3xl md:text-4xl font-semibold">What Veterinarians Say</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <motion.div whileHover={{y:-2}} >
          <div className="card p-6">
          <p className="text-gray-800 italic">"Fast, professional, and thorough. Our clinicians rely on Dr. Khan's imaging."</p>
           </div>
          </motion.div>
        <motion.div whileHover={{y:-2}} >
          <div className="card p-6">
          <p className="text-gray-800 italic">"Clear communication and actionable reports. Scheduling was easy."</p>
         </div>
          </motion.div>
        <motion.div whileHover={{y:-2}} >
          <div className="card p-6">
          <p className="text-gray-800 italic">"Great partner for our internal medicine team."</p>
         </div>
          </motion.div>
      </div>
    </section>
  )
}
