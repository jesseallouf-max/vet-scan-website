// components/Header.tsx
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function Header() {
  const [shadow, setShadow] = useState(false)
  const [open, setOpen] = useState(false)

  const barRef = useRef<HTMLDivElement | null>(null)
  const [barH, setBarH] = useState(0)

  // shadow on scroll
  useEffect(() => {
    const onScroll = () => setShadow(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // measure header height (for mobile panel top + anchor offset)
  useEffect(() => {
    const readBar = () => setBarH(barRef.current?.offsetHeight ?? 0)
    readBar()
    window.addEventListener('resize', readBar)
    return () => window.removeEventListener('resize', readBar)
  }, [])
  useEffect(() => {
    setBarH(barRef.current?.offsetHeight ?? 0)
  }, [shadow])
  useEffect(() => {
    document.documentElement.style.setProperty('--headerH', `${barH}px`)
  }, [barH])

  const shrunk = shadow

  return (
    <>
      <header
        className={`sticky top-0 z-40 ${shrunk ? 'bg-[#F4EEE2]/90' : 'bg-[#F4EEE2]'} backdrop-blur border-b border-gray-200 transition-[box-shadow,background-color] duration-200 ${
          shadow ? 'shadow-[0_1px_2px_rgba(0,0,0,0.20),0_2px_4px_rgba(0,0,0,0.28)]' : ''
        }`}
      >
        {/* md+: grid with fixed logo column so nav/CTA never shift when logo shrinks */}
        <div
          ref={barRef}
          className={`${shrunk ? 'py-2 md:py-3 lg:py-4' : 'py-2 md:py-6 lg:py-7'}
            max-w-[1120px] mx-auto px-5 transition-all duration-200
            flex items-center md:grid md:grid-cols-[340px_1fr_auto] lg:grid-cols-[380px_1fr_auto]`}
        >
          {/* COL 1: Logo */}
          <div className="flex items-center">
            {/* mobile logo */}
            <Link href="/" className="flex items-center md:hidden">
              <Image
                src="/images/vet-scan-logo-horizontal.png"
                alt="Vet Scan NYC"
                width={220}
                height={40}
                priority
                className="h-10 w-auto"
              />
            </Link>
            {/* desktop logo (baseline nudge) */}
            <Link href="/" className="hidden md:flex items-center">
              <Image
                src="/images/vet-scan-logo-horizontal.png"
                alt="Vet Scan NYC"
                width={380}
                height={72}
                priority
                className={`w-auto relative top-[2px] ${shrunk ? 'h-9 lg:h-11' : 'h-12 lg:h-14'} transition-all duration-200`}
              />
            </Link>
          </div>

          {/* COL 2: Desktop nav */}
          <div className="hidden md:flex items-center">
            <nav className="flex items-center gap-6 lg:gap-8 uppercase font-bold text-[17px] lg:text-[18px] tracking-wide">
              {[
                { href: '#services', label: 'Services' },
                { href: '#about', label: 'About' },
                { href: '#coverage', label: 'Coverage' },
                { href: '#contact', label: 'Contact' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="relative no-underline text-[#0E1215] hover:text-[#146C60] transition-colors duration-200
                             after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-current
                             after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-200"
                >
                  {item.label}
                </a>
              ))}

              {/* Desktop CTA right after links */}
              <a
                href="#contact" 
                className="ml-4 inline-flex btn btn-primary font-bold uppercase tracking-wide whitespace-nowrap
                           text-xs md:text-sm px-3 py-2 md:px-4 md:py-2.5"
              >
                BOOK NOW
              </a>
            </nav>
          </div>

          {/* COL 3: Mobile CTA + Hamburger (desktop hidden) */}
          <div className="ml-auto flex items-center md:hidden">
            {/* Mobile CTA — show only when panel is CLOSED */}
            {!open && (
              <a
                href="#contact"
                className="ml-auto inline-flex btn btn-primary font-bold uppercase tracking-wide whitespace-nowrap
                           text-xs px-3 py-2 mr-2"
              >
                BOOK NOW
              </a>
            )}

            {/* Hamburger */}
            <button
              type="button"
              className="inline-flex items-center justify-center h-10 w-10 p-0 rounded-md focus:outline-none focus:ring-0 outline-none"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE PANEL (no CTA here) */}
      {open && (
        <div
          className="fixed inset-x-0 bottom-0 z-50 md:hidden bg-[#146C60] text-white overflow-y-auto transition-transform duration-200"
          style={{ top: barH }}
        >
          <div className="relative flex h-full flex-col pt-[env(safe-area-inset-top)]">
            {/* Close */}
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-5 inline-flex items-center justify-center rounded-md px-3 py-2 focus:outline-none focus:ring-0 outline-none border border-white/40"
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <nav className="px-6 pt-5 pb-10">
              <a href="#services" onClick={() => setOpen(false)} className="block text-2xl font-semibold py-3">Services</a>
              <a href="#about" onClick={() => setOpen(false)} className="block text-2xl font-semibold py-3">About</a>
              <a href="#coverage" onClick={() => setOpen(false)} className="block text-2xl font-semibold py-3">Coverage</a>
              <a href="#contact" onClick={() => setOpen(false)} className="block text-2xl font-semibold py-3">Contact</a>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
