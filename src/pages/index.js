import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import MicroblogPane from "../components/MicroblogPane"
import DevActivityFeed from "../components/DevActivityFeed"
import useRotateText from "../hooks/useRotateText"

const IndexPage = ({ data }) => {
  const microblogPosts = data.allMdx.nodes
  const rotatingText = useRotateText(["passion.", "fun.", "a journey.", "LIFE.", "curiosity.", "craft."], 120)

  return (
    <Layout pageTitle="Home">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" style={{ minHeight: '88vh' }}>

        {/* Dot-grid overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99,102,241,0.5) 1px, transparent 0)',
          backgroundSize: '36px 36px'
        }} />

        {/* Floating tech pills — decorative */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <span className="absolute top-[18%] left-[6%] bg-blue-500/10 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-500/20 rotate-[-10deg]">TypeScript</span>
          <span className="absolute top-[28%] right-[8%] bg-purple-500/10 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/20 rotate-[7deg]">Azure</span>
          <span className="absolute top-[55%] left-[4%] bg-cyan-500/10 text-cyan-300 text-xs px-3 py-1 rounded-full border border-cyan-500/20 rotate-[5deg] hidden md:block">Kubernetes</span>
          <span className="absolute top-[62%] right-[6%] bg-green-500/10 text-green-300 text-xs px-3 py-1 rounded-full border border-green-500/20 rotate-[-8deg] hidden md:block">Docker</span>
          <span className="absolute top-[12%] right-[22%] bg-rose-500/10 text-rose-300 text-xs px-3 py-1 rounded-full border border-rose-500/20 rotate-[4deg] hidden lg:block">Angular</span>
          <span className="absolute top-[72%] left-[18%] bg-amber-500/10 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/20 rotate-[-5deg] hidden lg:block">Claude AI</span>
        </div>

        <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-6 py-16">

          {/* Name */}
          <p className="text-indigo-300/70 text-sm font-mono tracking-[0.3em] uppercase mb-4">
            Arun Paul
          </p>

          {/* Role badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Solutions &amp; Software Architect · CKA · AZ-303 · AZ-205 · PCA
          </div>

          {/* Rotating headline */}
          <h1
            className="font-bold mb-5 leading-tight tracking-tight whitespace-nowrap"
            style={{ fontSize: 'clamp(1.5rem, 4.5vw, 3rem)' }}
          >
            Programming is{' '}
            <span className="text-indigo-400 font-mono">
              {rotatingText}<span className="animate-pulse opacity-60">|</span>
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            17+ years delivering enterprise cloud-native platforms, AI solutions, and production-grade Kubernetes infrastructure for international clients.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('featured-projects').scrollIntoView({ behavior: 'smooth' })}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25">
              View Projects
            </button>
            <Link to="/about"
              className="border border-white/20 text-white/80 hover:text-white hover:border-white/40 hover:bg-white/5 px-7 py-3.5 rounded-xl font-semibold transition-all duration-200">
              About Me
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <button
          onClick={() => document.getElementById('microblog-strip').scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to latest posts"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-white/40 hover:text-white/70 transition-colors duration-200 flex flex-col items-center gap-1"
        >
          <span className="text-[10px] tracking-widest uppercase">Latest</span>
          <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center">
            <div className="w-0.5 h-2 bg-white/50 rounded-full mt-1.5 animate-pulse" />
          </div>
        </button>
      </section>

      {/* ── Credentials strip ────────────────────────────────────────────── */}
      <div className="bg-slate-900 border-y border-slate-800 py-5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate-400">
            {[
              { value: '17+', label: 'Years Experience' },
              { value: '300k+', label: 'DB Migration (zero-downtime)' },
              { value: 'CKA', label: 'Kubernetes Administrator' },
              { value: 'AZ-303/205', label: 'Azure Architect' },
              { value: 'PCA', label: 'Prometheus Certified' },
              { value: 'Azure · .NET · AI', label: 'Core Stack' },
            ].map(({ value, label }) => (
              <div key={value} className="flex items-center gap-2">
                <span className="text-indigo-400 font-semibold">{value}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MicroBlog strip ──────────────────────────────────────────────── */}
      <div id="microblog-strip">
        <MicroblogPane posts={microblogPosts} />
      </div>

      {/* ── Featured Projects ─────────────────────────────────────────────── */}
      <section id="featured-projects" className="py-20 bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur rounded-2xl mb-6">
              <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-white mb-3">Featured Projects</h2>
            <p className="text-purple-200 text-lg max-w-xl mx-auto">
              Production AI and cloud-native systems built to demonstrate real-world architecture skills.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

            {/* Malayalam Dictionary — flagship RAG project */}
            <Link to="/malayalam-dictionary"
              className="group bg-white/10 backdrop-blur border border-white/10 hover:border-emerald-400/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/40">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                  <svg className="w-7 h-7 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <div className="flex gap-2">
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full">Open Source</span>
                  <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">RAG · AI</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Malayalam-English Smart Dictionary</h3>
              <p className="text-purple-200 text-sm leading-relaxed mb-4">
                Production RAG pipeline — semantic search over Malayalam/English definitions using Azure OpenAI embeddings, Qdrant vector store, and ASP.NET Core 8 with Clean Architecture, DDD, and CQRS.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {['ASP.NET Core 8', 'Azure OpenAI', 'Qdrant', 'PostgreSQL', 'Redis', 'Docker'].map(t => (
                  <span key={t} className="bg-white/5 border border-white/10 text-white/60 text-xs px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center text-emerald-300 text-sm font-medium group-hover:text-emerald-200">
                  Try it live
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <a href="https://github.com/iarunpaul" target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-white/40 hover:text-white/70 text-xs flex items-center gap-1 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </div>
            </Link>

            {/* Career Copilot — AI project */}
            <Link to="/career-copilot"
              className="group bg-white/10 backdrop-blur border border-white/10 hover:border-orange-400/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-900/40">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                  <svg className="w-7 h-7 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex gap-2">
                  <span className="bg-orange-500/20 text-orange-300 text-xs font-semibold px-3 py-1 rounded-full">Live</span>
                  <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full">Claude API</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Career Copilot</h3>
              <p className="text-purple-200 text-sm leading-relaxed mb-4">
                AI career assistant powered by Claude API and LinkedIn MCP integration — extracts real-time job market signals, tailors interview preparation, and provides architecture-level career recommendations.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {['Claude API', 'MCP', 'Node.js', 'Express', 'Gatsby', 'Cheerio'].map(t => (
                  <span key={t} className="bg-white/5 border border-white/10 text-white/60 text-xs px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>
              <div className="flex items-center text-orange-300 text-sm font-medium group-hover:text-orange-200">
                Open Copilot
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* This site — Gatsby + AI */}
            <a href="https://github.com/iarunpaul" target="_blank" rel="noopener noreferrer"
              className="group bg-white/10 backdrop-blur border border-white/10 hover:border-blue-400/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/40">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <svg className="w-7 h-7 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                  </svg>
                </div>
                <div className="flex gap-2">
                  <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    Live
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI-Powered Developer Portfolio</h3>
              <p className="text-purple-200 text-sm leading-relaxed mb-4">
                This site — Gatsby 5 with Claude AI integration, live GitHub and Azure DevOps activity feeds, MCP servers, MDX technical blog, and Azure certification practice tools.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {['Gatsby 5', 'React', 'Tailwind CSS', 'Claude API', 'MCP', 'Azure DevOps'].map(t => (
                  <span key={t} className="bg-white/5 border border-white/10 text-white/60 text-xs px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>
              <div className="flex items-center text-blue-300 text-sm font-medium group-hover:text-blue-200">
                View source
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>

            {/* AZ-204 Learning Platform */}
            <Link to="/learn"
              className="group bg-white/10 backdrop-blur border border-white/10 hover:border-teal-400/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-900/40">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 bg-teal-500/20 rounded-xl flex items-center justify-center group-hover:bg-teal-500/30 transition-colors">
                  <svg className="w-7 h-7 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="bg-teal-500/20 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full">Azure Cert Prep</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Azure Certification Learning Hub</h3>
              <p className="text-purple-200 text-sm leading-relaxed mb-4">
                Interactive exam practice platform for AZ-204, AZ-900, and SC-900 — custom question engine with AI-assisted explanations and progress tracking.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {['React', 'Gatsby', 'Azure', 'AZ-204', 'AZ-900', 'SC-900'].map(t => (
                  <span key={t} className="bg-white/5 border border-white/10 text-white/60 text-xs px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>
              <div className="flex items-center text-teal-300 text-sm font-medium group-hover:text-teal-200">
                Open platform
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ── Developer Activity ───────────────────────────────────────────── */}
      <section id="main-content" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Developer Activity</h2>
            <p className="text-xl text-gray-600">
              Real commits, builds, and events from GitHub and Azure DevOps
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <DevActivityFeed githubUsername="iarunpaul" />
            </div>

            {/* Sidebar — Connect */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Connect</h3>
                <div className="space-y-3">
                  <a href="https://www.linkedin.com/in/arun-paul-polly-741042b9/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">LinkedIn</div>
                      <div className="text-xs text-gray-500">arun-paul-polly</div>
                    </div>
                  </a>
                  <a href="https://github.com/iarunpaul" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">GitHub</div>
                      <div className="text-xs text-gray-500">iarunpaul</div>
                    </div>
                  </a>
                  <a href="https://dev.azure.com/iarunpaul0142" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M0 12.267L2.99 7.67l7.174-4.44L13.184 0l2.978 2.302v4.21l5.838 1.578V18.74l-6.457 1.983-7.64-3.09-.152 3.09-4.254-.578L0 12.267z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Azure DevOps</div>
                      <div className="text-xs text-gray-500">iarunpaul0142</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Certifications summary */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Certifications</h3>
                <div className="space-y-2">
                  {[
                    { code: 'AZ-303', label: 'Azure Solutions Architect Technologies' },
                    { code: 'AZ-205', label: 'Azure Developer Associate' },
                    { code: 'CKA', label: 'Certified Kubernetes Administrator' },
                    { code: 'PCA', label: 'Prometheus Certified Associate' },
                  ].map(({ code, label }) => (
                    <div key={code} className="flex items-center gap-3 py-1.5">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded w-16 text-center flex-shrink-0">{code}</span>
                      <span className="text-xs text-gray-600">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Technology Focus Areas ───────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Technology Expertise</h2>
            <p className="text-xl text-gray-600">17+ years across enterprise architecture, cloud infrastructure, and AI systems</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="text-5xl mb-4">☁️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cloud & Infrastructure</h3>
              <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                Enterprise-scale Azure and AWS architecture, production Kubernetes (CKA-certified), KEDA autoscaling, Bicep/Terraform IaC, multi-cloud CI/CD pipelines.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Azure AKS', 'Kubernetes', 'KEDA', 'Bicep', 'Terraform', 'AWS', 'Docker', 'Helm'].map(t => (
                  <span key={t} className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs">{t}</span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI & RAG Systems</h3>
              <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                Production RAG pipelines, Azure OpenAI embeddings, Semantic Kernel orchestration, vector search with Qdrant, and multi-agent frameworks for enterprise AI.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Azure OpenAI', 'Semantic Kernel', 'RAG', 'Qdrant', 'Claude API', 'MCP', 'AutoGen'].map(t => (
                  <span key={t} className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-xs">{t}</span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Backend & Architecture</h3>
              <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                ASP.NET Core 8, Clean Architecture, DDD, CQRS, event-driven microservices, Angular microfrontends, and zero-credential security with Microsoft Entra.
              </p>
              <div className="flex flex-wrap gap-2">
                {['ASP.NET Core 8', 'C#', 'Java', 'Angular', 'DDD', 'CQRS', 'Microservices'].map(t => (
                  <span key={t} className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-xs">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Call to Action ───────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">Let's Build Something Together</h2>
          <p className="text-xl mb-8 text-indigo-200">
            Open to Solutions Architect, Software Architect, and senior engineering leadership opportunities. Let's talk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://linkedin.com/in/arun-paul-polly-741042b9"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Connect on LinkedIn
            </a>
            <Link
              to="/blog"
              className="border-2 border-white text-white hover:bg-white hover:text-indigo-700 px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Read the Blog
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  )
}

export const query = graphql`
  query {
    allMdx(
      filter: { internal: { contentFilePath: { regex: "/src/microblogs/" } } }
      sort: { frontmatter: { date: DESC } }
      limit: 10
    ) {
      nodes {
        frontmatter {
          title
          slug
          date(formatString: "MMM D")
        }
      }
    }
  }
`

export default IndexPage
