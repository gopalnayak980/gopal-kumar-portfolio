import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projectsContent } from '../data/portfolioData'

gsap.registerPlugin(ScrollTrigger)

// Load all project images eagerly with glob matching
const projectImages = import.meta.glob('../assets/projects/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
})

// Helper to find matching image file for a given project id
const getProjectImage = (id) => {
  const matchKey = Object.keys(projectImages).find((path) =>
    path.toLowerCase().includes(`/${id.toLowerCase()}.`)
  )
  return matchKey ? projectImages[matchKey] : null
}

// Helper to render title lines, formatting words enclosed in *asterisks*
const renderTitleLine = (line) => {
  const parts = line.split(/(\*[^*]+\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      const word = part.slice(1, -1)
      return (
        <span
          key={i}
          className="font-[family-name:var(--font-serif-accent)] font-light italic lowercase text-[#9CA3AF] tracking-normal"
        >
          {word}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function Projects({ onCtaClick = () => {} }) {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const projectRowsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        )
      }

      // Staggered entrance for each project item
      projectRowsRef.current.forEach((row) => {
        if (!row) return
        const imageEl = row.querySelector('.proj-image')
        const animEls = row.querySelectorAll('.proj-anim')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 80%',
            once: true,
          },
        })

        if (imageEl) {
          tl.fromTo(
            imageEl,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
          )
        }

        if (animEls.length > 0) {
          tl.fromTo(
            animEls,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 },
            '-=0.7'
          )
        }
      })
    }, sectionRef)

    const handleLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', handleLoad)

    return () => {
      window.removeEventListener('load', handleLoad)
      ctx.revert()
    }
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full bg-[#050505] text-white px-6 md:px-16 pt-20 pb-24 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* ── Section Header (two columns on desktop, stacked on mobile) ── */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-16 md:pb-24 border-b border-white/20"
        >
          {/* LEFT: Giant title + accent script */}
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none inline-block">
              <span
                style={{
                  background: 'linear-gradient(to bottom, #ffffff 0%, #d4d4d8 50%, #52525b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))',
                }}
              >
                {projectsContent.headingMain}
              </span>
              <span className="font-[family-name:var(--font-serif-accent)] font-light italic lowercase text-[#9CA3AF] text-3xl sm:text-4xl md:text-6xl lg:text-7xl ml-3 md:ml-5">
                {projectsContent.headingAccent}
              </span>
            </h2>
          </div>

          {/* RIGHT: Description + Lime pill button */}
          <div className="flex flex-col items-start md:items-start max-w-[420px]">
            <p className="text-[#9CA3AF] font-light text-sm md:text-base leading-relaxed mb-6">
              {projectsContent.description}
            </p>
            <a
              href={projectsContent.readMore.href}
              className="inline-flex items-center gap-2 bg-[#CCFF00] hover:bg-[#b8e600] text-black border border-[#CCFF00] rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
            >
              <span>{projectsContent.readMore.label}</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* ── Project List (Alternating editorial layout, NO cards) ── */}
        <div className="flex flex-col gap-24 md:gap-40 mt-20 md:mt-32">
          {projectsContent.items.map((project, index) => {
            const isImageLeft = index % 2 === 0
            const imgSrc = getProjectImage(project.id)

            return (
              <article
                key={project.id}
                ref={(el) => (projectRowsRef.current[index] = el)}
                className="group grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_auto] gap-y-6 md:gap-x-16 md:gap-y-6 md:items-center"
              >
                {/* 1. Header Block (number + title): order-1 on mobile */}
                <div
                  className={`order-1 ${
                    isImageLeft
                      ? 'md:col-start-2 md:row-start-1 md:self-end'
                      : 'md:col-start-1 md:row-start-1 md:self-end'
                  }`}
                >
                  <span className="proj-anim text-[#CCFF00] font-bold text-sm uppercase tracking-[0.3em] block mb-3 md:mb-4">
                    {project.number}
                  </span>
                  <h3 className="proj-anim font-extrabold uppercase tracking-tight text-[30px] sm:text-[40px] md:text-[clamp(1.9rem,4.5vw,3.5rem)] lg:text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] text-white">
                    {project.title.map((line, lineIdx) => (
                      <span key={lineIdx} className="block">
                        {renderTitleLine(line)}
                      </span>
                    ))}
                  </h3>
                </div>

                {/* 2. Image Block: order-2 on mobile, spans 2 rows on desktop */}
                <div
                  className={`order-2 proj-image ${
                    isImageLeft
                      ? 'md:col-start-1 md:row-start-1 md:row-span-2'
                      : 'md:col-start-2 md:row-start-1 md:row-span-2'
                  }`}
                >
                  <div className="relative w-full aspect-[16/10] bg-zinc-900 rounded-[3px] overflow-hidden">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={project.title.join(' ')}
                        loading="lazy"
                        className="w-full h-full object-cover opacity-90 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-[#0d0d10] to-[#050505] flex flex-col items-center justify-center p-6 text-center select-none border border-white/5 transition-colors duration-500 group-hover:border-white/10">
                        <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest mb-2">
                          {project.number}
                        </span>
                        <span className="text-zinc-400 font-mono text-sm tracking-wider uppercase">
                          {project.id}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Body Block (description + buttons): order-3 on mobile */}
                <div
                  className={`order-3 ${
                    isImageLeft
                      ? 'md:col-start-2 md:row-start-2 md:self-start'
                      : 'md:col-start-1 md:row-start-2 md:self-start'
                  }`}
                >
                  <p className="proj-anim text-[#9CA3AF] font-light text-sm md:text-base leading-[1.7] max-w-[500px] mb-8">
                    {project.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="proj-anim flex flex-wrap items-center gap-4">
                    {/* Live Demo CTA */}
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onCtaClick('live', project)}
                      className="inline-flex items-center gap-2 bg-[#CCFF00] hover:bg-[#b8e600] text-black border border-[#CCFF00] rounded-full px-6 py-2.5 text-xs md:text-sm font-semibold tracking-wider uppercase transition-colors duration-200"
                    >
                      <span>Live Demo</span>
                      <span>↗</span>
                    </a>

                    {/* GitHub CTA */}
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onCtaClick('github', project)}
                      className="inline-flex items-center gap-2.5 bg-transparent hover:bg-white text-white hover:text-black border border-white/30 hover:border-white rounded-full px-6 py-2.5 text-xs md:text-sm font-medium tracking-wider uppercase transition-all duration-200"
                    >
                      <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Projects
