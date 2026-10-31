import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { personalInfo, aboutContent, skillRows } from '../data/portfolioData'

// Register ScrollTrigger once with GSAP
gsap.registerPlugin(ScrollTrigger)

// Load about portrait image with graceful fallback
const aboutImages = import.meta.glob('../assets/about/about-portrait.*', {
  eager: true,
  import: 'default',
})
const aboutImageSrc = Object.values(aboutImages)[0] || null

function About() {
  const sectionRef = useRef(null)
  const mobileHeadingRef = useRef(null)
  const desktopHeadingRef = useRef(null)
  const cardRef = useRef(null)

  // Split paragraph into words while tracking highlighted terms
  const words = aboutContent.paragraph.split(/\s+/).filter(Boolean)

  useEffect(() => {
    // GSAP context ensures all tweens and ScrollTriggers are cleaned up properly
    const ctx = gsap.context(() => {
      // 1. Heading entrance animations (mobile & desktop)
      const headings = [mobileHeadingRef.current, desktopHeadingRef.current].filter(Boolean)
      headings.forEach((heading) => {
        gsap.fromTo(
          heading,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              once: true,
            },
          }
        )
      })

      // 2. Word-by-word reading highlight animation in the glass card
      if (cardRef.current) {
        const wordEls = cardRef.current.querySelectorAll('[data-word]')
        if (wordEls.length > 0) {
          gsap.fromTo(
            wordEls,
            { color: '#52525b', opacity: 0.2 },
            {
              color: (_i, el) => (el.dataset.highlight === 'true' ? '#ffffff' : '#d4d4d8'),
              opacity: 1,
              stagger: 0.1,
              ease: 'none',
              scrollTrigger: {
                trigger: cardRef.current,
                start: 'top 85%',
                end: 'bottom 50%',
                scrub: true,
              },
            }
          )
        }
      }
    }, sectionRef)

    // Recalculate ScrollTrigger positions on window load and after font/image layout stabilization
    const handleLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', handleLoad)
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 600)

    return () => {
      window.removeEventListener('load', handleLoad)
      clearTimeout(refreshTimer)
      ctx.revert()
    }
  }, [])

  return (
    <section id="about" ref={sectionRef} className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* ── Intro Content Section ── */}
      <div className="min-h-screen max-w-[1280px] mx-auto px-6 md:px-12 py-20 md:py-32 flex flex-col justify-center">
        {/* Mobile Heading (centered above portrait) */}
        <h2
          ref={mobileHeadingRef}
          className="block lg:hidden text-center text-[18vw] sm:text-[8rem] font-black uppercase leading-[0.85] tracking-tighter mb-8 select-none"
          style={{
            background: 'linear-gradient(to bottom, #ffffff 0%, #d4d4d8 50%, #52525b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))',
          }}
        >
          {aboutContent.heading}
        </h2>

        {/* Two-column layout on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* LEFT: Portrait */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            {aboutImageSrc ? (
              <img
                src={aboutImageSrc}
                alt={`${personalInfo.name} — portrait`}
                className="w-[190px] sm:w-[220px] lg:w-[260px] h-auto object-contain"
                style={{ filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.7))' }}
              />
            ) : (
              <div className="w-[190px] sm:w-[220px] lg:w-[260px] h-[280px] rounded-2xl border border-white/10 flex items-center justify-center text-white/30 text-xs">
                Portrait image not found
              </div>
            )}
          </div>

          {/* RIGHT: Desktop heading + Glass description card */}
          <div className="lg:col-span-8 flex flex-col">
            {/* Desktop Heading (aligned left above card) */}
            <h2
              ref={desktopHeadingRef}
              className="hidden lg:block text-left text-[8rem] lg:text-[11rem] font-black uppercase leading-[0.85] tracking-tighter mb-8 select-none"
              style={{
                background: 'linear-gradient(to bottom, #ffffff 0%, #d4d4d8 50%, #52525b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))',
              }}
            >
              {aboutContent.heading}
            </h2>

            {/* Glass About Card */}
            <div
              ref={cardRef}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[28px] shadow-2xl shadow-black/60 p-6 md:p-10 transition-colors duration-500 hover:bg-white/[0.08]"
            >
              <h3 className="text-white text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 text-center lg:text-left">
                {aboutContent.greeting}
              </h3>

              <p className="text-base md:text-[20px] font-light leading-relaxed text-zinc-400 text-center lg:text-left">
                {words.map((word, idx) => {
                  // Clean punctuation to match highlight keywords
                  const clean = word.replace(/[.,/#!$%^&*;:{}=\-_`~()—"']/g, '').trim()
                  const isHighlighted = aboutContent.highlights.some((hl) => {
                    const cleanHl = hl.replace(/[.,/#!$%^&*;:{}=\-_`~()—"']/g, '').trim().toLowerCase()
                    return (
                      clean.toLowerCase() === cleanHl ||
                      hl.toLowerCase().split(/\s+/).includes(clean.toLowerCase())
                    )
                  })

                  return (
                    <span
                      key={idx}
                      data-word
                      data-highlight={isHighlighted ? 'true' : undefined}
                      className={`inline-block mr-[0.28em] transition-colors ${
                        isHighlighted ? 'font-semibold' : ''
                      }`}
                      style={{ color: '#52525b', opacity: 0.2 }}
                    >
                      {word}
                    </span>
                  )
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Skills Marquee (Full width) ── */}
      <div className="w-full bg-[#030303] border-t border-white/5 py-8 md:py-12 space-y-4 md:space-y-6">
        {skillRows.slice(0, 4).map((row, rowIndex) => {
          // Alternating marquee directions:
          // Row 0 & 2 (1st & 3rd): left to right (.marquee-right)
          // Row 1 & 3 (2nd & 4th): right to left (.marquee-left)
          const isLeftToRight = rowIndex % 2 === 0
          const marqueeClass = isLeftToRight ? 'marquee-right' : 'marquee-left'

          // Repeat items 3 times in each half to ensure seamless loop across any viewport width
          const repeatedItems = [...row.items, ...row.items, ...row.items]

          return (
            <div key={row.label} className="relative w-full overflow-hidden py-2 md:py-3">
              {/* Pinned Label on the left with gradient fade */}
              <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-6 md:pl-12 pr-10 md:pr-16 bg-gradient-to-r from-[#030303] via-[#030303]/95 to-transparent pointer-events-none">
                <span className="text-white text-xs md:text-sm font-bold uppercase tracking-[0.3em] whitespace-nowrap">
                  {row.label}
                </span>
              </div>

              {/* Seamless Scrolling Track (two identical halves) */}
              <div className={`flex w-max ${marqueeClass}`}>
                {/* First half */}
                <div className="flex items-center gap-6 md:gap-8 px-4 shrink-0">
                  {repeatedItems.map((item, itemIdx) => (
                    <span key={itemIdx} className="flex items-center gap-6 md:gap-8 shrink-0">
                      <span className="text-sm md:text-[18px] font-medium tracking-wider text-zinc-400 hover:text-white transition-colors duration-200">
                        {item}
                      </span>
                      <span className="text-zinc-600 select-none text-xs md:text-sm">·</span>
                    </span>
                  ))}
                </div>

                {/* Second half (aria-hidden duplicate for seamless 50% keyframe loop) */}
                <div className="flex items-center gap-6 md:gap-8 px-4 shrink-0" aria-hidden="true">
                  {repeatedItems.map((item, itemIdx) => (
                    <span key={itemIdx} className="flex items-center gap-6 md:gap-8 shrink-0">
                      <span className="text-sm md:text-[18px] font-medium tracking-wider text-zinc-400 hover:text-white transition-colors duration-200">
                        {item}
                      </span>
                      <span className="text-zinc-600 select-none text-xs md:text-sm">·</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default About
