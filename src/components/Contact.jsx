import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  personalInfo,
  socialLinks,
  contactContent,
  emailjsConfig,
} from '../data/portfolioData'

gsap.registerPlugin(ScrollTrigger)

function Contact() {
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'success' | 'error'

  const sectionRef = useRef(null)
  const formRef = useRef(null)
  const headingRef = useRef(null)
  const detailsRef = useRef(null)
  const socialsRef = useRef(null)
  const formWrapRef = useRef(null)
  const submitBtnRef = useRef(null)

  // Subtle GSAP ScrollTrigger timeline entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      })

      // 1. Heading entrance
      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        )
      }

      // 2. Contact details (email & phone)
      if (detailsRef.current) {
        const detailItems = detailsRef.current.querySelectorAll('.contact-item')
        if (detailItems.length > 0) {
          tl.fromTo(
            detailItems,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15 },
            '-=0.7'
          )
        }
      }

      // 3. Social buttons scale/fade
      if (socialsRef.current) {
        const socialBtns = socialsRef.current.querySelectorAll('a')
        if (socialBtns.length > 0) {
          tl.fromTo(
            socialBtns,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1 },
            '-=0.5'
          )
        }
      }

      // 4. Form fields stagger up
      if (formWrapRef.current) {
        const fields = formWrapRef.current.querySelectorAll('.form-field')
        if (fields.length > 0) {
          tl.fromTo(
            fields,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 },
            '-=0.6'
          )
        }
      }

      // 5. Submit button fades in last
      if (submitBtnRef.current) {
        tl.fromTo(
          submitBtnRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Handle form submission: EmailJS when configured, mailto fallback otherwise
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending' || !formRef.current) return

    setStatus('sending')

    const isConfigured =
      emailjsConfig.serviceId &&
      emailjsConfig.serviceId !== 'YOUR_EMAILJS_SERVICE_ID' &&
      emailjsConfig.templateId &&
      emailjsConfig.templateId !== 'YOUR_EMAILJS_TEMPLATE_ID' &&
      emailjsConfig.publicKey &&
      emailjsConfig.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY'

    if (!isConfigured) {
      // Fallback to mailto link
      try {
        const formData = new FormData(formRef.current)
        const name = formData.get('user_name') || ''
        const email = formData.get('user_email') || ''
        const phone = formData.get('user_phone') || ''
        const subject = formData.get('subject') || `Portfolio Contact from ${name}`
        const message = formData.get('message') || ''

        const body = `From: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
        const mailtoUrl = `mailto:${personalInfo.email}?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`

        window.open(mailtoUrl, '_blank')
        formRef.current.reset()
        setStatus('success')
      } catch (err) {
        console.error('Mailto error:', err)
        setStatus('error')
      } finally {
        setTimeout(() => setStatus('idle'), 4000)
      }
    } else {
      // Send via @emailjs/browser
      try {
        const emailjs = await import('@emailjs/browser')
        await emailjs.sendForm(
          emailjsConfig.serviceId,
          emailjsConfig.templateId,
          formRef.current,
          emailjsConfig.publicKey
        )
        formRef.current.reset()
        setStatus('success')
      } catch (err) {
        console.error('EmailJS send error:', err)
        setStatus('error')
      } finally {
        setTimeout(() => setStatus('idle'), 4000)
      }
    }
  }

  // Social icons definitions
  const socialItems = [
    {
      name: 'Instagram',
      url: socialLinks.instagram,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      url: socialLinks.youtube,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: socialLinks.linkedin,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      url: socialLinks.github,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
    },
  ].filter((item) => Boolean(item.url))

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen bg-[#050505] text-white px-6 md:px-16 py-24 md:py-32 overflow-hidden flex flex-col justify-center"
    >
      {/* ── Soft, diffused neon-green horizon glow ── */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] md:w-[1300px] h-[350px] md:h-[450px] rounded-full blur-[140px] opacity-25"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(120,200,40,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1300px] w-full mx-auto relative z-10">
        {/* Two-column editorial grid on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 lg:gap-20 items-start">
          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col">
            {/* Heading */}
            <h2
              ref={headingRef}
              className="text-[clamp(3rem,8vw,6.5rem)] font-black uppercase tracking-tighter leading-[0.9] mb-10 md:mb-14 select-none"
              style={{
                background: 'linear-gradient(to bottom, #ffffff 0%, #d4d4d8 50%, #52525b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))',
              }}
            >
              {contactContent.heading}
            </h2>

            {/* Contact Details */}
            <div ref={detailsRef} className="space-y-6 mb-10 md:mb-14">
              {/* Email */}
              <div className="contact-item">
                <span className="text-xs uppercase tracking-widest text-[#9CA3AF] mb-1 block">
                  Email:
                </span>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="text-lg md:text-xl font-medium tracking-wide text-white hover:text-[#CCFF00] transition-colors duration-200 inline-block"
                >
                  {personalInfo.email}
                </a>
              </div>

              {/* Phone */}
              {personalInfo.phone && (
                <div className="contact-item">
                  <span className="text-xs uppercase tracking-widest text-[#9CA3AF] mb-1 block">
                    Phone:
                  </span>
                  <a
                    href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
                    className="text-lg md:text-xl font-medium tracking-wide text-white hover:text-[#CCFF00] transition-colors duration-200 inline-block"
                  >
                    {personalInfo.phone}
                  </a>
                </div>
              )}
            </div>

            {/* Social Buttons */}
            {socialItems.length > 0 && (
              <div ref={socialsRef}>
                <span className="text-xs uppercase tracking-widest text-[#9CA3AF] mb-3 block">
                  {contactContent.followLabel}
                </span>
                <div className="flex items-center gap-3">
                  {socialItems.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(204,255,0,0.2)] hover:scale-105 transition-all duration-300"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN: The Form ── */}
          <div ref={formWrapRef}>
            <form ref={formRef} onSubmit={handleSubmit} className="w-full">
              {/* Row 1: Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="form-field flex flex-col">
                  <label htmlFor="user_name" className="text-xs uppercase tracking-wider text-[#9CA3AF] mb-2 font-medium">
                    Your Name
                  </label>
                  <input
                    id="user_name"
                    name="user_name"
                    type="text"
                    required
                    placeholder="Your full name"
                    className="w-full bg-[#111111] border border-white/5 rounded-[10px] px-4 py-3.5 text-white placeholder:text-zinc-600 text-sm md:text-base focus:outline-none focus:border-white/25 focus:ring-1 focus:ring-[#CCFF00]/30 transition-all duration-200"
                  />
                </div>

                <div className="form-field flex flex-col">
                  <label htmlFor="user_email" className="text-xs uppercase tracking-wider text-[#9CA3AF] mb-2 font-medium">
                    Email address
                  </label>
                  <input
                    id="user_email"
                    name="user_email"
                    type="email"
                    required
                    placeholder="Your email address"
                    className="w-full bg-[#111111] border border-white/5 rounded-[10px] px-4 py-3.5 text-white placeholder:text-zinc-600 text-sm md:text-base focus:outline-none focus:border-white/25 focus:ring-1 focus:ring-[#CCFF00]/30 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Row 2: Phone + Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="form-field flex flex-col">
                  <label htmlFor="user_phone" className="text-xs uppercase tracking-wider text-[#9CA3AF] mb-2 font-medium">
                    Phone
                  </label>
                  <input
                    id="user_phone"
                    name="user_phone"
                    type="tel"
                    placeholder="Your phone number"
                    className="w-full bg-[#111111] border border-white/5 rounded-[10px] px-4 py-3.5 text-white placeholder:text-zinc-600 text-sm md:text-base focus:outline-none focus:border-white/25 focus:ring-1 focus:ring-[#CCFF00]/30 transition-all duration-200"
                  />
                </div>

                <div className="form-field flex flex-col">
                  <label htmlFor="subject" className="text-xs uppercase tracking-wider text-[#9CA3AF] mb-2 font-medium">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Subject"
                    className="w-full bg-[#111111] border border-white/5 rounded-[10px] px-4 py-3.5 text-white placeholder:text-zinc-600 text-sm md:text-base focus:outline-none focus:border-white/25 focus:ring-1 focus:ring-[#CCFF00]/30 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Row 3: Message */}
              <div className="form-field flex flex-col mb-6 md:mb-8">
                <label htmlFor="message" className="text-xs uppercase tracking-wider text-[#9CA3AF] mb-2 font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Write something...."
                  className="w-full bg-[#111111] border border-white/5 rounded-[10px] px-4 py-3.5 text-white placeholder:text-zinc-600 text-sm md:text-base resize-none focus:outline-none focus:border-white/25 focus:ring-1 focus:ring-[#CCFF00]/30 transition-all duration-200"
                />
              </div>

              {/* Submit Button */}
              <div ref={submitBtnRef}>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-white hover:bg-zinc-200 text-black font-semibold rounded-[9px] py-4 px-6 text-sm md:text-base tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed select-none"
                >
                  {status === 'sending' ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </div>

              {/* Status Message Notification */}
              {status === 'success' && (
                <p role="status" className="mt-4 text-center text-sm font-medium text-[#CCFF00]">
                  Message sent successfully!
                </p>
              )}
              {status === 'error' && (
                <p role="status" className="mt-4 text-center text-sm font-medium text-red-400">
                  Failed to send message. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
