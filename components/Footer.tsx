export default function Footer(){
  return (
    <footer className="mt-16 bg-gradient-to-br from-slate-50 to-gray-100 border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="section py-12">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Stay Informed on Veterinary Imaging
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Get updates on new services, imaging techniques, and exclusive insights for veterinary professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors"
              required
            />
            <button 
              type="submit"
              className="px-6 py-3 rounded-md font-semibold text-white transition-all duration-200 hover:shadow-lg"
              style={{ background: '#146C60' }}
            >
              Subscribe
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-3">
            For veterinary professionals only. Unsubscribe anytime.
          </p>
        </div>
      </div>

      {/* Main Footer Content - NEW APPROACH */}
      <div className="border-t border-gray-200 bg-white">
        <div className="section py-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3">
              
              {/* Column 1 - Company Info */}
              <div className="px-4 mb-8 md:mb-0">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Vet Scan NYC</h4>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Expert ultrasound services for veterinary clinics in Manhattan.
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Coverage:</strong> Manhattan below 125th St</p>
                  <p><strong>Response:</strong> Within 24-48 hours</p>
                </div>
              </div>

              {/* Column 2 - Services */}
              <div className="px-4 mb-8 md:mb-0">
                <h4 className="text-lg font-bold text-gray-900 mb-4">VetScan NYC Services</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li><a href="#services" className="hover:text-teal-600 transition-colors">Abdominal Ultrasound</a></li>
                  <li><a href="#services" className="hover:text-teal-600 transition-colors">Ultrasound-Guided Procedures</a></li>
                </ul>
              </div>

              {/* Column 3 - Quick Links */}
              <div className="px-4 mb-8 md:mb-0">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li><a href="#about" className="hover:text-teal-600 transition-colors">About Dr. Khan</a></li>
                  <li><a href="#coverage" className="hover:text-teal-600 transition-colors">Coverage Map</a></li>
                  <li><a href="#contact" className="hover:text-teal-600 transition-colors">Request Services</a></li>
                  <li><a href="#services" className="hover:text-teal-600 transition-colors">Services</a></li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="section py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Vet Scan NYC. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-teal-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-teal-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-teal-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
