import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Certifications from "../components/Certifications"
import GitHubActivity from "../components/GitHubActivity"

const SKILLS = [
  {
    category: "Backend Development",
    color: "blue",
    tags: ["ASP.NET Core", "C#", ".NET 8", "Entity Framework Core", "Dapper", "MediatR", "FluentValidation", "Java", "Spring Boot", "Maven"],
  },
  {
    category: "Frontend",
    color: "violet",
    tags: ["Angular", "TypeScript", "Nx Monorepos", "Module Federation"],
  },
  {
    category: "Cloud Platforms",
    color: "sky",
    tags: ["Azure Functions", "Azure SQL", "AKS", "Container Apps", "Event Grid", "Cognitive Search", "Key Vault", "Application Insights", "AWS EC2", "AWS EKS", "AWS S3", "AWS IAM"],
  },
  {
    category: "AI & Data",
    color: "emerald",
    tags: ["Azure OpenAI", "Semantic Kernel", "RAG Pipelines", "Qdrant", "Azure Cognitive Search", "PostgreSQL", "Redis Enterprise", "Power BI"],
  },
  {
    category: "DevOps & Infrastructure",
    color: "orange",
    tags: ["Docker", "Kubernetes (AKS)", "KEDA", "Helm", "Prometheus", "Grafana", "Bicep (IaC)", "Terraform", "GitHub Actions", "Azure DevOps", "OpenTelemetry"],
  },
  {
    category: "Security & Identity",
    color: "rose",
    tags: ["Microsoft Entra", "Managed Identities", "Workload Identity", "Zero-Credential Patterns"],
  },
  {
    category: "Architecture & Patterns",
    color: "purple",
    tags: ["Domain-Driven Design", "Event-Driven Architecture", "Microservices", "CQRS", "Clean Architecture", "RESTful APIs", "Git", "GitHub", "Postman"],
  },
]

const FEATURED_CERTS = [
  {
    code: "AZ-303",
    name: "Microsoft Azure Solutions Architect Technologies",
    issuer: "Microsoft",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-600",
    text: "text-blue-700",
  },
  {
    code: "AZ-205",
    name: "Microsoft Azure Developer Associate",
    issuer: "Microsoft",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-500",
    text: "text-blue-700",
  },
  {
    code: "CKA",
    name: "Certified Kubernetes Administrator",
    issuer: "Cloud Native Computing Foundation (CNCF)",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    badge: "bg-indigo-600",
    text: "text-indigo-700",
  },
  {
    code: "PCA",
    name: "Prometheus Certified Associate",
    issuer: "Cloud Native Computing Foundation (CNCF)",
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-500",
    text: "text-orange-700",
  },
]

const colorMap = {
  blue:    { bg: "bg-blue-100",   text: "text-blue-800"   },
  violet:  { bg: "bg-violet-100", text: "text-violet-800" },
  sky:     { bg: "bg-sky-100",    text: "text-sky-800"    },
  emerald: { bg: "bg-emerald-100",text: "text-emerald-800"},
  orange:  { bg: "bg-orange-100", text: "text-orange-800" },
  rose:    { bg: "bg-rose-100",   text: "text-rose-800"   },
  purple:  { bg: "bg-purple-100", text: "text-purple-800" },
}

const AboutPage = () => {
  return (
    <Layout pageTitle="About">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(99,102,241,0.5) 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }} />
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-indigo-300/70 text-sm font-mono tracking-[0.3em] uppercase mb-3">
            About Me
          </p>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            Arun Paul
          </h1>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Solutions &amp; Software Architect · CKA · AZ-303 · AZ-205 · PCA
          </div>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-3xl mb-10">
            Senior Solutions &amp; Software Architect with 17+ years translating complex enterprise
            business requirements into cloud-native platforms, AI-powered SaaS solutions, and
            production-grade distributed systems. Currently at{" "}
            <span className="text-indigo-300 font-semibold">Ariqt</span>, an IT services and
            consulting firm, leading end-to-end solution design for international enterprise clients.
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-slate-400">
            {[
              ["17+", "Years Experience"],
              ["300k+", "DB Migration (zero-downtime)"],
              ["Azure · .NET · AI", "Core Stack"],
              ["Ariqt", "IT Services & Consulting"],
            ].map(([val, lbl]) => (
              <div key={val} className="flex items-center gap-2">
                <span className="text-indigo-400 font-semibold">{val}</span>
                <span>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Professional Profile ─────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Professional Profile</h2>
          <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
            <p>
              I design and deliver enterprise technology solutions for international clients at Ariqt —
              an IT services and consulting firm. My work spans the full solution lifecycle: from
              requirements discovery and technology evaluation through to architecture proposals,
              hands-on implementation, and engineering governance across simultaneous client engagements.
            </p>
            <p>
              Key accomplishments include designing a zero-downtime cloud consolidation strategy that
              migrated 300,000+ Azure SQL databases from per-customer single-tenant to shared
              multi-tenant architecture, building AI-powered financial forecasting platforms using
              Microsoft Foundry, Semantic Kernel, and RAG pipelines, and designing production-grade
              Kubernetes clusters on Azure AKS with KEDA event-driven autoscaling.
            </p>
            <p>
              I'm equally comfortable presenting architecture proposals to executive stakeholders as
              I am leading engineering teams through complex cloud modernisation programmes — and I
              thrive at the intersection of business strategy and hands-on technical delivery. Versatile
              across .NET (ASP.NET Core, C#) and JVM (Java, Spring Boot) ecosystems.
            </p>
          </div>

          {/* Key highlights */}
          <div className="grid sm:grid-cols-3 gap-5 mt-12">
            {[
              {
                icon: "☁️",
                title: "Cloud Architecture",
                desc: "Enterprise Azure & AWS architecture, zero-downtime migrations, multi-cloud infrastructure",
              },
              {
                icon: "🤖",
                title: "AI & RAG Systems",
                desc: "Production RAG pipelines, Azure OpenAI, Semantic Kernel, vector search, multi-agent frameworks",
              },
              {
                icon: "⚡",
                title: "DevOps & Kubernetes",
                desc: "CKA-certified, AKS cluster design, KEDA autoscaling, Bicep/Terraform, CI/CD pipelines",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills & Technologies ────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Skills &amp; Technologies</h2>
          <p className="text-gray-500 mb-12">17+ years across enterprise architecture, cloud, and AI systems</p>

          <div className="space-y-8">
            {SKILLS.map(({ category, color, tags }) => {
              const { bg, text } = colorMap[color]
              return (
                <div key={category} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span key={tag} className={`${bg} ${text} text-sm px-3 py-1.5 rounded-full font-medium`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Certifications ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Certifications</h2>
          <p className="text-gray-500 mb-10">Industry credentials across cloud architecture, Kubernetes, and observability</p>

          {/* Featured 4 — always visible, static */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {FEATURED_CERTS.map(({ code, name, issuer, bg, border, badge, text }) => (
              <div key={code} className={`${bg} ${border} border rounded-xl p-5 flex flex-col gap-3`}>
                <div className="flex items-center gap-3">
                  <span className={`${badge} text-white text-xs font-bold px-2.5 py-1 rounded-lg font-mono`}>
                    {code}
                  </span>
                </div>
                <div>
                  <p className={`${text} font-semibold text-sm leading-snug mb-1`}>{name}</p>
                  <p className="text-gray-500 text-xs">{issuer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* LinkedIn-sourced certifications via component */}
          <div className="border-t border-gray-100 pt-10">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">All Certifications</h3>
            <Certifications />
          </div>
        </div>
      </section>

      {/* ── GitHub Activity ──────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">GitHub Activity</h2>
          <p className="text-gray-500 mb-10">Open-source contributions and project work</p>
          <GitHubActivity username={process.env.GATSBY_GITHUB_USERNAME || "iarunpaul"} />
        </div>
      </section>

    </Layout>
  )
}

export const Head = () => <Seo header="About — Arun Paul | Solutions & Software Architect" />
export default AboutPage
