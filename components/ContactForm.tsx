import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ContactForm(){
  const [status,setStatus]=useState<'idle'|'loading'|'ok'|'error'>('idle')
  const [message,setMessage]=useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedService, setSelectedService] = useState('Abdominal Ultrasound')
  const [allowTexting, setAllowTexting] = useState(false)
  const [isEmergency, setIsEmergency] = useState(false)


  const services = [
    'Abdominal Ultrasound',
    'Second Opinions / Teleconsult'
  ]

  // Scroll to top of contact section when switching between states
  useEffect(() => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [status])

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, '')
    const phoneNumberLength = phoneNumber.length
    if (phoneNumberLength < 4) return phoneNumber
    if (phoneNumberLength < 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value)
    e.target.value = formattedNumber
  }

  async function handleSubmit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault(); setStatus('loading'); setMessage('')
    const form=e.currentTarget; const data=Object.fromEntries(new FormData(form) as any)
    data.service = selectedService
    data.allowTexting = allowTexting
    data.isEmergency = isEmergency
    try{
      const res=await fetch('/api/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
      const json=await res.json(); if(!res.ok) throw new Error(json.error||'Request failed')
      setStatus('ok'); setMessage('Thank you - your request has been received. We will respond within 24-48 hours.'); 
    }catch(err:any){ setStatus('error'); setMessage(err.message||'Something went wrong. Please email vetscannyc@gmail.com.') }
  }

  if (status === 'ok') {
    return (
      <section id="contact" className="section">
        <div className="card p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
            <div className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #146C60, #0f5a50)' }}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Request Received!</h2>
            <p className="text-lg text-gray-600 mb-8">Thank you for reaching out. Here's what happens next:</p>
            
            <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm" style={{ backgroundColor: '#F4EEE2', boxShadow: '0 1px 3px rgba(20, 108, 96, 0.2)' }}>
                  <span className="text-sm font-semibold" style={{ color: '#146C60' }}>1</span>
                </div>
                <p className="text-gray-700"><strong>Within 24-48 hours:</strong> Dr. Khan will review your request and respond with availability and pricing.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm" style={{ backgroundColor: '#F4EEE2', boxShadow: '0 1px 3px rgba(20, 108, 96, 0.2)' }}>
                  <span className="text-sm font-semibold" style={{ color: '#146C60' }}>2</span>
                </div>
                <p className="text-gray-700"><strong>Schedule:</strong> We'll coordinate a convenient time that works with your clinic's schedule.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm" style={{ backgroundColor: '#F4EEE2', boxShadow: '0 1px 3px rgba(20, 108, 96, 0.2)' }}>
                  <span className="text-sm font-semibold" style={{ color: '#146C60' }}>3</span>
                </div>
                <p className="text-gray-700"><strong>Service & Report:</strong> Professional scan performed at your location with same-day reporting.</p>
              </div>
            </div>

            {allowTexting && (
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-700">
                  <strong>✓ Texting enabled</strong> - Dr. Khan may reach out via text for quicker coordination.
                </p>
              </div>
            )}

            {isEmergency && (
              <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800">
                  <strong>🚨 Emergency request noted</strong> - Dr. Khan will prioritize your request and respond ASAP.
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={() => setStatus('idle')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Submit Another Request
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="section">
      {/* Title outside the card */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-semibold">Request a Quote</h2>
        <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">For veterinary clinics</span>
      </div>
      
      <div className="card p-8">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Clinic Name *</label>
            <input required name="clinicName" className="mt-1 w-full rounded-xl border px-3 py-2"/>
          </div>
          
          <div>
            <label className="block text-sm font-medium">Contact Name *</label>
            <input required name="contactName" className="mt-1 w-full rounded-xl border px-3 py-2"/>
          </div>
          
          <div>
            <label className="block text-sm font-medium">Role/Title *</label>
            <input required name="role" className="mt-1 w-full rounded-xl border px-3 py-2"/>
          </div>
          
          <div>
            <label className="block text-sm font-medium">Work Email *</label>
            <input 
              required 
              type="email" 
              name="email" 
              className="mt-1 w-full rounded-xl border px-3 py-2 invalid:border-red-300 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500"
              placeholder="yourname@clinic.com"
              title="Please enter a valid email address with @ symbol"
              onInvalid={(e) => {
                e.currentTarget.setCustomValidity('Please enter a valid email address (example: name@clinic.com)')
              }}
              onInput={(e) => {
                e.currentTarget.setCustomValidity('')
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Phone (optional)</label>
            <input 
              name="phone" 
              placeholder="555-123-4567"
              maxLength={12}
              onChange={handlePhoneChange}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Service Needed *</label>
            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full rounded-xl border px-3 py-2 text-left bg-white flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <span>{selectedService}</span>
                <motion.svg
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </motion.svg>
              </button>
              
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg"
                >
                  {services.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => {
                        setSelectedService(service)
                        setIsDropdownOpen(false)
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors duration-150"
                    >
                      {service}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Notes</label>
            <textarea 
              name="notes" 
              placeholder="Tell us about your case, preferred timing, or any special requirements..."
              className="mt-1 w-full rounded-xl border px-3 py-2 resize-none overflow-hidden min-h-[3.5rem]" 
              rows={2}
              onChange={handleTextareaChange}
            />
          </div>
          
          <div className="flex items-center gap-3 md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input 
                  id="allowTexting" 
                  type="checkbox"
                  checked={allowTexting}
                  onChange={(e) => setAllowTexting(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  allowTexting 
                    ? 'bg-teal-600 border-teal-600' 
                    : 'bg-white border-gray-300 hover:border-gray-400'
                }`}>
                  {allowTexting && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm">OK to text me for quicker coordination</span>
            </label>
          </div>

          <div className="flex items-center gap-3 md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input 
                  id="isEmergency" 
                  type="checkbox"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  isEmergency 
                    ? 'bg-orange-600 border-orange-600' 
                    : 'bg-white border-gray-300 hover:border-gray-400'
                }`}>
                  {isEmergency && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm">🚨 This is an emergency situation requiring urgent attention</span>
            </label>
          </div>
          
          <div className="md:col-span-2 flex items-center gap-3 mt-6">
            <button type="submit" className="btn-hero-responsive" disabled={status==='loading'}>
              {status==='loading'?'Sending…':'Send Request'}
            </button>
            {status === 'error' && <p className="text-sm text-red-600">{message}</p>}
          </div>
        </form>
      </div>
    </section>
  )
}
