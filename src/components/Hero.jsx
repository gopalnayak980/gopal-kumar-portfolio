import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { personalInfo, heroContent } from '../data/portfolioData'

// ── Load hero image with graceful fallback ──
const heroImages = import.meta.glob('../assets/hero/hero-portrait.*', {
  eager: true,
  import: 'default',
})
const heroImageSrc = Object.values(heroImages)[0] || null

function Hero() {
  // The text that scrambles from the brand name into "PORTFOLIO"
  const [displayText, setDisplayText] = useState(
    personalInfo.brandName.toUpperCase()
  )

  // Refs for GSAP-animated elements
  const headingRef = useRef(null)
  const imageRef = useRef(null)
  const subtitleRef = useRef(null)
  const controlsRef = useRef(null)

  // Split the role at the first space: bold word + light italic rest
  const spaceIdx = personalInfo.role.indexOf(' ')
  const roleBold =
    spaceIdx > -1 ? personalInfo.role.slice(0, spaceIdx) : personalInfo.role
  const roleLight =
    spaceIdx > -1 ? personalInfo.role.slice(spaceIdx + 1) : ''

  useEffect(() => {
    // Capture ref values for safe cleanup later
    const headingEl = headingRef.current
    const imageEl = imageRef.current
    const subtitleEl = subtitleRef.current
    const controlsEl = controlsRef.current

    // Lock page scrolling during the intro sequence
    document.body.style.overflow = 'hidden'

    // Set initial GSAP states: person off-screen, controls invisible
    gsap.set(imageEl, { y: '100vh' })
    gsap.set([subtitleEl, controlsEl], { opacity: 0, y: 50 })

    // Scramble config
    const finalWord = heroContent.finalWord.toUpperCase()
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let scrambleInterval = null
    let lockInterval = null
    let lockedCount = 0
    let startTimeout = null
    let pauseTimeout = null
    let tl = null

    // ── Start the full animation sequence ──
    const startSequence = () => {
      // 1. Wait ~1 second after the image has loaded
      startTimeout = setTimeout(() => {
        // 2. Begin the letter-by-letter scramble effect
        scrambleInterval = setInterval(() => {
          let text = ''
          for (let i = 0; i < finalWord.length; i++) {
            text +=
              i < lockedCount
                ? finalWord[i]
                : chars[Math.floor(Math.random() * chars.length)]
          }
          setDisplayText(text)
        }, 50)

        // 3. Lock one more correct letter every ~100 ms from the left
        lockInterval = setInterval(() => {
          lockedCount++
          if (lockedCount >= finalWord.length) {
            clearInterval(lockInterval)
            clearInterval(scrambleInterval)
            setDisplayText(finalWord)

            // 4. Brief pause, then GSAP entrance timeline
            pauseTimeout = setTimeout(() => {
              const isMobile = window.innerWidth < 768

              tl = gsap.timeline({
                onComplete: () => {
                  document.body.style.overflow = 'auto'
                },
              })

              // (a) Slide the huge typography upward
              tl.to(
                headingEl,
                {
                  top: isMobile ? '20%' : '45%',
                  duration: 1.5,
                  ease: 'power3.inOut',
                },
                0
              )

              // (b) Bring the person up from below the viewport
              tl.to(
                imageEl,
                {
                  y: 0,
                  duration: 1.5,
                  ease: 'power3.out',
                },
                0
              )

              // (c) Fade in subtitle then contact controls
              tl.to(
                [subtitleEl, controlsEl],
                {
                  opacity: 1,
                  y: 0,
                  duration: 1.2,
                  ease: 'power3.out',
                  stagger: 0.2,
                },
                0.3
              )
            }, 400)
          }
        }, 100)
      }, 1000)
    }

    // Preload the hero image before kicking off the animation
    if (heroImageSrc) {
      const img = new Image()
      img.onload = startSequence
      img.onerror = startSequence
      img.src = heroImageSrc
    } else {
      startSequence()
    }

    // ── Cleanup on unmount ──
    return () => {
      clearInterval(scrambleInterval)
      clearInterval(lockInterval)
      clearTimeout(startTimeout)
      clearTimeout(pauseTimeout)
      if (tl) tl.kill()
      gsap.killTweensOf([headingEl, imageEl, subtitleEl, controlsEl])
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <header id="home" className="min-h-screen w-full relative overflow-hidden">
      {/* ── Radial gradient background ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at center, #1c1c1f 0%, #000000 70%)',
        }}
      />

      {/* ── Subtle dark overlay with backdrop blur ── */}
      <div className="absolute inset-0 z-[5] bg-black/10 backdrop-blur-[2px]" />

      {/* ── Huge metallic typography (BEHIND the person) ── */}
      <h1
        ref={headingRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-10 select-none pointer-events-none"
        aria-label={`${personalInfo.brandName} — ${heroContent.finalWord}`}
        style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))' }}
      >
        <span
          aria-hidden="true"
          className="text-[16vw] md:text-[10rem] 2xl:text-[14rem] font-black uppercase leading-none tracking-tighter inline-block"
          style={{
            background:
              'linear-gradient(to bottom, #ffffff 0%, #d4d4d8 50%, #52525b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {displayText}
        </span>
      </h1>

      {/* ── Hero portrait (transparent cut-out, overlaps typography) ── */}
      <div
        ref={imageRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))' }}
      >
        {heroImageSrc ? (
          <img
            src={heroImageSrc}
            alt={personalInfo.name}
            className="h-auto w-auto max-h-[88vh] max-w-[72vw] md:max-w-[500px] xl:max-w-[650px] object-contain"
          />
        ) : (
          <div className="h-[60vh] flex items-end justify-center text-white/30 text-sm">
            Portrait image not found
          </div>
        )}
      </div>

      {/* ── Subtitle + contact controls (z-30, IN FRONT of everything) ── */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-5 px-6 pb-10 md:flex-row md:items-end md:justify-between md:px-[8%] md:pb-[8%]">
        {/* Role subtitle */}
        <div
          ref={subtitleRef}
          className="text-center md:text-left"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
        >
          <p className="text-base md:text-[2.5rem] 2xl:text-[3.5rem] text-white/90 leading-tight">
            <span className="font-bold">{roleBold}</span>{' '}
            <span className="font-light italic text-white/70">
              {roleLight}
            </span>
          </p>
        </div>

        {/* Contact controls */}
        <div ref={controlsRef} className="flex items-center gap-3">
          {/* Circular diagonal-arrow icon button */}
          <a
            href="#contact"
            className="group h-12 w-12 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/40"
            aria-label="Go to contact section"
          >
            <svg
              className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M9 7h8v8"
              />
            </svg>
          </a>

          {/* Pill-shaped "Contact" button */}
          <a
            href="#contact"
            className="rounded-full bg-black/40 backdrop-blur-md border border-white/20 px-8 py-3 text-white text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:border-white/40"
          >
            {heroContent.ctaLabel}
          </a>
        </div>
      </div>
    </header>
  )
}

export default Hero
