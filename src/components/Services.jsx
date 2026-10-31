import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { servicesContent } from '../data/portfolioData'

gsap.registerPlugin(ScrollTrigger)

function Services() {
  const [openIndex, setOpenIndex] = useState(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  const sectionRef = useRef(null)
  const headingRef = useRef(null)

  // Track window width for mobile behavior vs desktop hover states
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // GSAP ScrollTrigger entrance animation for the header
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: -100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Toggle accordion row: single open item at a time
  const toggleRow = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className="w-full bg-[#050505] text-white px-6 md:px-12 py-24 md:py-32 overflow-hidden"
    >
      {/* ── Giant Header (top-right) ── */}
      <div className="flex justify-end mb-16 md:mb-24">
        <h2
          ref={headingRef}
          className="text-right ml-auto font-black uppercase tracking-tighter leading-[0.85] text-4xl sm:text-6xl md:text-[7rem] lg:text-[8rem] select-none"
          style={{
            background: 'linear-gradient(to bottom, #ffffff 0%, #d4d4d8 50%, #52525b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))',
          }}
        >
          {servicesContent.headingLines.map((line, idx) => (
            <span key={idx} className="block">
              {line}
            </span>
          ))}
        </h2>
      </div>

      {/* ── Accordion List (full width) ── */}
      <div className="w-full border-t border-white/20">
        {servicesContent.items.map((item, index) => {
          const isOpen = openIndex === index
          const isHovered = !isMobile && hoveredIndex === index
          const isActive = isOpen || isHovered

          return (
            <div
              key={item.title}
              onMouseEnter={() => !isMobile && setHoveredIndex(index)}
              onMouseLeave={() => !isMobile && setHoveredIndex(null)}
              className={`border-b border-white/20 transition-colors duration-300 -mx-6 md:-mx-12 px-6 md:px-12 ${
                isActive ? 'bg-[#CCFF00] text-black' : 'bg-transparent text-white'
              }`}
            >
              {/* Row Header Button */}
              <button
                type="button"
                onClick={() => toggleRow(index)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between py-6 md:py-10 text-left cursor-pointer select-none"
              >
                <div className="flex items-center min-w-0 grow pr-4">
                  {/* Service Number */}
                  <span
                    className={`w-12 md:w-24 font-mono text-sm md:text-xl font-bold tracking-wider shrink-0 transition-colors duration-300 ${
                      isActive ? 'text-black' : 'text-white/60'
                    }`}
                  >
                    0{index + 1}
                  </span>

                  {/* Service Title */}
                  <span
                    className={`grow font-light uppercase tracking-tight text-[1.1rem] sm:text-2xl md:text-[3rem] truncate md:overflow-visible md:whitespace-normal transition-colors duration-300 ${
                      isActive ? 'text-black font-normal' : 'text-white font-light'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>

                {/* Minimalist Outlined Arrow Icon */}
                <svg
                  viewBox="0 0 48 24"
                  className={`w-6 h-6 md:w-10 md:h-10 shrink-0 ml-4 transition-transform duration-300 ease-out ${
                    isOpen ? '-rotate-45' : 'rotate-45'
                  } ${isActive ? 'text-black' : 'text-[#CCFF00]'}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12h42M34 3l10 9-10 9" />
                </svg>
              </button>

              {/* Accordion Expandable Content (CSS Grid Transition) */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pt-2 pb-8 md:pt-4 md:pb-12 pl-12 md:pl-24">
                    {/* Desktop: 2 columns; Mobile: 1 column */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                      {/* Capabilities Column */}
                      <div className="md:col-span-5">
                        <ul className="space-y-3">
                          {item.capabilities.map((cap) => (
                            <li key={cap} className="flex items-center gap-3">
                              <span
                                className={`w-2 h-2 shrink-0 transition-colors duration-300 ${
                                  isActive ? 'bg-black' : 'bg-[#CCFF00]'
                                }`}
                              />
                              <span
                                className={`text-sm md:text-base font-light transition-colors duration-300 ${
                                  isActive ? 'text-black' : 'text-zinc-300'
                                }`}
                              >
                                {cap}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Description & CTA Column */}
                      <div className="md:col-span-7 flex flex-col justify-between">
                        <p
                          className={`max-w-xl font-light text-sm sm:text-base md:text-lg leading-relaxed transition-colors duration-300 ${
                            isActive ? 'text-black/85' : 'text-zinc-300'
                          }`}
                        >
                          {item.description}
                        </p>

                        {/* CTA button (with 4 technical corner marks) */}
                        {item.cta && (
                          <div className="mt-8 pt-2">
                            <div className="relative inline-block">
                              <span className="absolute -top-1.5 -left-1.5 w-2 h-2 border-t-2 border-l-2 border-black pointer-events-none" />
                              <span className="absolute -top-1.5 -right-1.5 w-2 h-2 border-t-2 border-r-2 border-black pointer-events-none" />
                              <span className="absolute -bottom-1.5 -left-1.5 w-2 h-2 border-b-2 border-l-2 border-black pointer-events-none" />
                              <span className="absolute -bottom-1.5 -right-1.5 w-2 h-2 border-b-2 border-r-2 border-black pointer-events-none" />
                              <a
                                href={item.cta.href}
                                className="block bg-black text-[#CCFF00] font-bold uppercase tracking-widest text-xs px-10 py-3.5 transition-colors duration-200 hover:bg-zinc-900"
                              >
                                {item.cta.label}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Services
