import React from 'react'
import { Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import Layout from '../components/layout'

const certifications = [
  {
    id: 'az-204',
    title: 'AZ-204',
    subtitle: 'Azure Developer Associate',
    description: 'Practice questions covering Azure compute, storage, security, monitoring, and third-party services. Includes hotspot, drag-and-drop, and scenario-based questions.',
    link: '/az-204-exam',
    questionCount: 454,
    status: 'active',
    tags: ['Azure', 'Cloud', 'Developer'],
    gradient: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-100',
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    stats: [
      { label: 'Questions', value: '454' },
      { label: 'Series', value: '13' },
      { label: 'With Answers', value: '100%' },
    ],
  },
  {
    id: 'az-900',
    title: 'AZ-900',
    subtitle: 'Azure Fundamentals',
    description: 'Core Azure concepts — cloud fundamentals, pricing, SLAs, and the Azure service model. Entry-level certification for anyone new to cloud.',
    link: null,
    questionCount: null,
    status: 'coming',
    tags: ['Azure', 'Fundamentals'],
    gradient: 'from-sky-400 to-blue-500',
    iconBg: 'bg-sky-100',
    icon: (
      <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    stats: [],
  },
  {
    id: 'sc-900',
    title: 'SC-900',
    subtitle: 'Security, Compliance & Identity',
    description: 'Foundational knowledge of security, compliance, and identity concepts across Microsoft cloud services.',
    link: null,
    questionCount: null,
    status: 'coming',
    tags: ['Azure', 'Security'],
    gradient: 'from-red-400 to-rose-600',
    iconBg: 'bg-red-100',
    icon: (
      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    stats: [],
  },
]

const LearnPage = () => (
  <Layout pageTitle="Learning Lab">
    <Helmet>
      <title>Learning Lab | Azure Certification Practice</title>
      <meta name="description" content="Personal certification practice hub — Azure exam questions with explanations, images, and community insights." />
    </Helmet>

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900">

      {/* Hero */}
      <div className="text-center py-20 px-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur rounded-2xl mb-8">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-5xl font-bold text-white mb-4">Learning Lab</h1>
        <p className="text-xl text-blue-200 max-w-2xl mx-auto">
          Certification practice built for depth — scenario-based questions, answer images, community vote insights, and full explanations.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map(cert => (
            <div key={cert.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-xl ${cert.status === 'coming' ? 'opacity-70' : 'hover:shadow-2xl hover:-translate-y-1'} transition-all duration-300`}>

              {/* Card top gradient bar */}
              <div className={`h-2 bg-gradient-to-r ${cert.gradient}`} />

              <div className="p-6">
                {/* Header row */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`${cert.iconBg} p-3 rounded-xl`}>
                    {cert.icon}
                  </div>
                  {cert.status === 'coming' ? (
                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Active
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900">{cert.title}</h2>
                <p className="text-sm font-medium text-gray-500 mb-3">{cert.subtitle}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{cert.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {cert.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{tag}</span>
                  ))}
                </div>

                {/* Stats */}
                {cert.stats.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {cert.stats.map(s => (
                      <div key={s.label} className="text-center bg-gray-50 rounded-lg py-2">
                        <div className="font-bold text-gray-900 text-sm">{s.value}</div>
                        <div className="text-gray-500 text-xs">{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA */}
                {cert.link ? (
                  <Link to={cert.link}
                    className={`block text-center w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r ${cert.gradient} hover:opacity-90 transition-opacity`}>
                    Start Practice
                  </Link>
                ) : (
                  <button disabled
                    className="block text-center w-full py-3 rounded-xl text-gray-400 font-semibold bg-gray-100 cursor-not-allowed">
                    Not Yet Available
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-blue-300/60 text-sm mt-12">
          Questions sourced from community discussions and official practice material. Use alongside official Microsoft Learn paths.
        </p>
      </div>
    </div>
  </Layout>
)

export default LearnPage
