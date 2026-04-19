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
      {/* Hero Section */}
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

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Software Architect · Cloud · AI
          </div>

          {/* Rotating headline — the star of the show */}
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
            Building cloud-native systems, exploring AI integration, and sharing what I learn along the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/blog"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25">
              Read the Blog
            </Link>
            <Link to="/about"
              className="border border-white/20 text-white/80 hover:text-white hover:border-white/40 hover:bg-white/5 px-7 py-3.5 rounded-xl font-semibold transition-all duration-200">
              About Me
            </Link>
          </div>
        </div>

        {/* Scroll hint — points at the microblog strip just below */}
        <button
          onClick={() => document.getElementById('microblog-strip').scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to latest posts"
          title="See latest posts"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-white/40 hover:text-white/70 transition-colors duration-200 flex flex-col items-center gap-1"
        >
          <span className="text-[10px] tracking-widest uppercase">Latest</span>
          <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center">
            <div className="w-0.5 h-2 bg-white/50 rounded-full mt-1.5 animate-pulse" />
          </div>
        </button>
      </section>

      {/* MicroBlog strip — visible just below first fold */}
      <div id="microblog-strip">
        <MicroblogPane posts={microblogPosts} />
      </div>

      {/* Personal Lounge */}
      <section id="personal-lounge" className="py-20 bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur rounded-2xl mb-6">
              <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-white mb-3">Personal Lounge</h2>
            <p className="text-purple-200 text-lg max-w-xl mx-auto">
              A quiet space for my own study and organisation. Not really a public feature — just where I come to train and stay on top of things.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* AZ-204 Card */}
            <Link to="/learn"
              className="group bg-white/10 backdrop-blur border border-white/10 hover:border-blue-400/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/40">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <svg className="w-7 h-7 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">Personal Study</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">AZ-204 Exam Practice</h3>
              <p className="text-purple-200 text-sm leading-relaxed mb-5">
                Where I train for the Azure Developer Associate exam. Practice questions, work through the material at my own pace — this one's for me, not really meant as a public resource.
              </p>
              <div className="flex items-center text-blue-300 text-sm font-medium group-hover:text-blue-200">
                Go to my study space
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Todo App Card */}
            <a href="https://victorious-hill-0dfe19203.6.azurestaticapps.net" target="_blank" rel="noopener noreferrer"
              className="group bg-white/10 backdrop-blur border border-white/10 hover:border-teal-400/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-900/40">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 bg-teal-500/20 rounded-xl flex items-center justify-center group-hover:bg-teal-500/30 transition-colors">
                  <svg className="w-7 h-7 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <span className="bg-teal-500/20 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  Live
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Todo App</h3>
              <p className="text-purple-200 text-sm leading-relaxed mb-5">
                How I keep myself organised. A personal task list — nothing fancy, just what I need to stay on track.
              </p>
              <div className="flex items-center text-teal-300 text-sm font-medium group-hover:text-teal-200">
                Open my tasks
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>

            {/* Career Copilot Card */}
            <Link to="/career-copilot"
              className="group bg-white/10 backdrop-blur border border-white/10 hover:border-orange-400/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-900/40">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                  <svg className="w-7 h-7 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="bg-orange-500/20 text-orange-300 text-xs font-semibold px-3 py-1 rounded-full">Personal Tool</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Career Copilot</h3>
              <p className="text-purple-200 text-sm leading-relaxed mb-5">
                A personal AI assistant I use to think through career moves, prep for conversations, and get a second opinion on professional decisions.
              </p>
              <div className="flex items-center text-orange-300 text-sm font-medium group-hover:text-orange-200">
                Open Copilot
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Malayalam Dictionary Card */}
            <Link to="/malayalam-dictionary"
              className="group bg-white/10 backdrop-blur border border-white/10 hover:border-emerald-400/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/40">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                  <svg className="w-7 h-7 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full">Personal Tool</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Malayalam Dictionary</h3>
              <p className="text-purple-200 text-sm leading-relaxed mb-5">
                A handy reference I built for myself — look up Malayalam words, meanings, and usage. Useful when I want to stay connected to the language.
              </p>
              <div className="flex items-center text-emerald-300 text-sm font-medium group-hover:text-emerald-200">
                Open Dictionary
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Developer Activity Section */}
      <section id="main-content" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Developer Activity</h2>
            <p className="text-xl text-gray-600">
              Real commits, builds, and events from GitHub and Azure DevOps
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Activity Feed — main */}
            <div className="lg:col-span-2">
              <DevActivityFeed githubUsername="iarunpaul" />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Connect */}
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

              {/* ADO setup guide */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0 12.267L2.99 7.67l7.174-4.44L13.184 0l2.978 2.302v4.21l5.838 1.578V18.74l-6.457 1.983-7.64-3.09-.152 3.09-4.254-.578L0 12.267z"/>
                  </svg>
                  Enable Azure DevOps
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">
                  Add these two lines to your <code className="bg-gray-100 px-1 rounded">.env.local</code> to see your ADO commits and builds alongside GitHub:
                </p>
                <pre className="bg-gray-900 text-green-400 text-xs rounded-lg p-3 overflow-x-auto leading-relaxed">{`GATSBY_AZURE_DEVOPS_ORG=iarunpaul0142
GATSBY_AZURE_DEVOPS_PAT=<your-pat>`}</pre>
                <p className="text-xs text-gray-400 mt-2">
                  Create a PAT at dev.azure.com → User settings → Personal access tokens. Grant <em>Code (Read)</em> and <em>Build (Read)</em> scopes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Focus Areas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Technology Focus Areas
            </h2>
            <p className="text-xl text-gray-600">
              Exploring the latest trends and innovations in software development
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-6xl mb-4">☁️</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Cloud Architecture</h3>
              <p className="text-gray-600 mb-6">
                Scalable cloud-native solutions, containerization strategies, 
                and distributed systems design patterns for modern applications.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Kubernetes</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Docker</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Azure</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">AI Integration</h3>
              <p className="text-gray-600 mb-6">
                Model Context Protocol (MCP) implementations, AI-powered content 
                generation, and intelligent automation for modern workflows.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">MCP</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Claude AI</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Automation</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Modern Development</h3>
              <p className="text-gray-600 mb-6">
                Latest frameworks, development methodologies, and tools that 
                enhance productivity and code quality in software projects.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">TypeScript</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Angular</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">DevOps</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">
            Experience AI-Powered Professional Insights
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            This website showcases cutting-edge MCP integration with Claude AI for 
            real-time LinkedIn activity analysis and intelligent content generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://linkedin.com/in/arun-paul-polly-741042b9"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Connect on LinkedIn
            </a>
            <Link 
              to="/blog"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Read AI-Enhanced Articles
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

