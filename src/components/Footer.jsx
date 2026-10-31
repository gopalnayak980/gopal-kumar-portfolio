import {
  personalInfo,
  socialLinks,
  footerContent,
} from '../data/portfolioData'

// Load footer background image with graceful fallback
const footerImages = import.meta.glob('../assets/footer/footer-bg.*', {
  eager: true,
  import: 'default',
})
const footerBgSrc = Object.values(footerImages)[0] || null

// Social links config — skip any with empty URLs
const socialItems = [
  { name: 'Instagram', url: socialLinks.instagram },
  { name: 'YouTube', url: socialLinks.youtube },
  { name: 'LinkedIn', url: socialLinks.linkedin },
  { name: 'GitHub', url: socialLinks.github },
].filter((item) => Boolean(item.url))

// Compute the current year once at module level (avoids React Compiler purity warning)
const currentYear = new Date().getFullYear()

function Footer() {
  // Build background style: image if available, CSS gradient fallback
  const bgStyle = footerBgSrc
    ? {
        backgroundImage: `url("${footerBgSrc}")`,
        backgroundPosition: 'center bottom',
        backgroundSize: '160%',
        backgroundRepeat: 'no-repeat',
      }
    : {
        backgroundImage:
          'radial-gradient(ellipse at center bottom, rgba(120,220,40,0.35) 0%, transparent 60%)',
      }

  return (
    <footer className="relative min-h-screen w-full bg-black text-white overflow-hidden flex flex-col">
      {/* ── Background Layer ── */}
      <div className="absolute inset-0 z-0" style={bgStyle} />

      {/* ── Gradient Overlay: solid black top → semi-transparent → transparent bottom ── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black via-black/70 to-transparent" />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col justify-between grow px-6 md:px-16 pt-20 md:pt-32 pb-8 md:pb-12">
        {/* ── TOP: Two-column editorial grid ── */}
        <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-16 md:mb-24">
          {/* LEFT: Connect label, email, nav links */}
          <div className="flex flex-col items-start">
            <span className="text-xs uppercase tracking-[0.3em] text-[#9CA3AF] mb-4 md:mb-6">
              {footerContent.connectLabel}
            </span>

            <a
              href={`mailto:${personalInfo.email}`}
              className="text-[clamp(1.4rem,4vw,3rem)] font-semibold text-white/90 hover:text-[#CCFF00] transition-colors duration-300 leading-tight mb-8 md:mb-10 break-all"
            >
              {personalInfo.email}
            </a>

            <nav className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {footerContent.navLinks.map((link, idx) => (
                <span key={link.label} className="flex items-center gap-2">
                  <a
                    href={link.href}
                    className="text-sm md:text-base text-[#9CA3AF] hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                  {idx < footerContent.navLinks.length - 1 && (
                    <span className="text-[#9CA3AF]/40 select-none">·</span>
                  )}
                </span>
              ))}
            </nav>
          </div>

          {/* RIGHT: CTA heading, text, and pill button */}
          <div className="flex flex-col items-start md:items-end md:text-right">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              {footerContent.ctaHeading}
            </h2>
            <p className="text-sm md:text-base text-[#9CA3AF] font-light leading-relaxed max-w-md mb-8">
              {footerContent.ctaText}
            </p>
            <a
              href="#contact"
              className="inline-block bg-white text-black font-semibold rounded-full px-8 py-3.5 text-sm md:text-base hover:bg-zinc-200 hover:scale-[1.03] transition-all duration-200"
            >
              {footerContent.ctaLabel}
            </a>
          </div>
        </div>

        {/* ── SOCIAL LINKS ROW ── */}
        {socialItems.length > 0 && (
          <div className="max-w-[1400px] w-full mx-auto border-t border-white/10 pt-6 md:pt-8 mb-12 md:mb-20">
            <div className="flex flex-wrap justify-between gap-4 md:gap-6">
              {socialItems.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm md:text-base font-medium text-[#9CA3AF] hover:text-white transition-colors duration-200"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── HUGE BRAND TYPOGRAPHY ── */}
        <div className="w-full flex justify-center mb-12 md:mb-20 select-none pointer-events-none">
          <h3 className="text-[12vw] md:text-[12vw] font-bold uppercase tracking-tighter leading-none whitespace-nowrap text-white">
            {personalInfo.brandName}
          </h3>
        </div>

        {/* ── BOTTOM ROW ── */}
        <div className="max-w-[1400px] w-full mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#9CA3AF]/60">
          {/* Left: Copyright */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span>
              © {currentYear} {personalInfo.name}. All Rights Reserved.
            </span>
          </div>

          {/* Right: Privacy and Terms */}
          <div className="flex items-center gap-4">
            <a
              href="#home"
              className="hover:text-white/60 transition-colors duration-200"
            >
              Privacy policy
            </a>
            <a
              href="#home"
              className="hover:text-white/60 transition-colors duration-200"
            >
              Terms and conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
