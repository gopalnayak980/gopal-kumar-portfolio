# Project context
React 19 + Vite + Tailwind CSS 4 single-page developer portfolio, "cinematic dark editorial" style. Plain JavaScript (JSX), no TypeScript, no router. Libraries: gsap (with ScrollTrigger), @emailjs/browser. Style: Tailwind utility classes only (no extra CSS files except src/index.css). Colours: near-black #050505 backgrounds, white and gray text (#9CA3AF secondary), ONE accent colour: electric lime #CCFF00. Fonts: Inter for everything; Playfair Display light italic only for small accent words. Headings: huge, extra-bold, uppercase, very tight letter spacing, white-to-gray vertical gradient (transparent text with background-clip).

# Architecture rules
- ALL content (text, links, lists) lives in src/data/portfolioData.js and is imported by components. Never hard-code personal content in components.
- One component per section in src/components/, composed in order in src/App.jsx: Hero, About, (IntroVideo), Services, Projects, Contact, Footer. There is no navbar. Navigation is anchor links (#home, #about, #services, #projects, #contact) with CSS smooth scrolling. No router.
- Assets: src/assets/hero/hero-portrait.png, src/assets/about/about-portrait.png, src/assets/footer/footer-bg.(png|jpg|webp), src/assets/projects/project-1.(png|jpg|webp) etc. Components load them with import.meta.glob and show a graceful placeholder when a file is missing.
- Animation rules (GSAP): register ScrollTrigger once (gsap.registerPlugin(ScrollTrigger)); create animations inside useEffect with gsap.context() and always clean up (ctx.revert(), clear timers/intervals, restore document.body.style.overflow). Entrance animations use `once: true` or play-and-stay: NO element may ever become invisible again after it has appeared, even if the visitor scrolls away and back. Call ScrollTrigger.refresh() on window 'load' because images and fonts change the layout. Respect prefers-reduced-motion where simple.
- Keep code clean and lightly commented in a beginner-friendly way. After every task run `npm run lint` and fix problems.


