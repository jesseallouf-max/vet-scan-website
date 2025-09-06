import Image from "next/image";

export default function About(){
  // Future‑proof: add/remove items here and the grid will auto-wrap into new rows
  const creds = [
    {
      logo: "/images/logo-upenn.png",
      alt: "University of Pennsylvania",
      heading: "VMD & vMBA",
      sub: "University of Pennsylvania",
    },
    {
      logo: "/images/logo-avi.png",
      alt: "Sound Academy of Veterinary Imaging",
      heading: "Ultrasound certified",
      sub: "Sound® Academy of Veterinary Imaging",
    },
    {
      logo: "/images/logo-amc.png",
      alt: "Animal Medical Center (NYC)",
      heading: "Internship",
      sub: "The Animal Medical Center, NYC",
    },
  ];

  // Headshot gallery (provide your own images later)
  const headshots = [
    { src: "/images/headshot-2.png", alt: "Dr. Amelia Khan with doodle" },
    { src: "/images/headshot-3.png", alt: "Dr. Amelia Khan at clinic" },
    { src: "/images/headshot-4.png", alt: "Dr. Amelia Khan with small dog" }
  ];

  return (
    <section id="about" className="section scroll-offset" aria-labelledby="about-heading">
      {/* Header */}
      <h2 id="about-heading" className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
        About Dr. Amelia Khan
      </h2>

      {/* Desktop: Better balance - content has breathing room, images closer */}
      <div className="mt-6 grid gap-8 lg:grid-cols-5 lg:items-start">
        {/* Left: narrative + credential cards (3 columns on desktop) */}
        <div className="lg:col-span-3">
          <p className="text-gray-700 text-lg">
            Dr. Amelia Khan brings 15 years of small animal veterinary experience and 9 years of specialized ultrasound expertise directly to your practice. Certified by Sound® Academy of Veterinary Imaging, she provides comprehensive mobile diagnostic services to veterinary clinics across Manhattan.
          </p>

          {/* Logo-forward credential cards; 1-col mobile, 2-col sm, 1-col desktop for vertical stacking */}
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5 lg:gap-12" aria-label="Credentials">
            {creds.map((c) => (
              <li key={c.heading}>
                {/* Logo card only - removed all text below */}
                <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                  <div className="relative mx-auto h-16 md:h-24 w-full">
                    {c.logo ? (
                      <Image src={c.logo} alt={c.alt} fill sizes="(min-width: 1024px) 16rem, (min-width: 768px) 12rem, 100vw" className="object-contain" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-md bg-neutral-100 text-base font-semibold text-neutral-700">
                        Logo
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: headshot card (2 columns on desktop) */}
        <div className="lg:col-span-2">
          {/* Mobile: horizontal swipe gallery */}
          <div className="lg:hidden -mx-4 px-4" aria-label="Headshot gallery">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 pr-6 -mr-4">
              {headshots.map((img, i) => (
                <div
                  key={i}
                  className="relative snap-start shrink-0 w-[78%] sm:w-[70%] max-w-sm aspect-[4/3] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 28rem, (min-width: 768px) 22rem, 85vw"
                    className="object-cover object-center"
                    priority={i === 0}
                  />
                </div>
              ))}
              <div className="shrink-0 w-6" aria-hidden="true" />
            </div>
          </div>

          {/* Desktop: stacked images, better sized and positioned */}
          <div className="hidden lg:flex lg:flex-col lg:gap-6 lg:pl-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm">
              <Image
                src={headshots[0].src}
                alt={headshots[0].alt}
                fill
                sizes="(min-width: 1024px) 22rem, (min-width: 768px) 18rem, 100vw"
                className="object-cover object-center"
                priority
              />
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm">
              <Image
                src={headshots[1].src}
                alt={headshots[1].alt}
                fill
                sizes="(min-width: 1024px) 22rem, (min-width: 768px) 18rem, 100vw"
                className="object-cover object-center"
              />
            </div>
             <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm">
              <Image
                src={headshots[2].src}
                alt={headshots[2].alt}
                fill
                sizes="(min-width: 1024px) 22rem, (min-width: 768px) 18rem, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
