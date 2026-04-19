import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import Layout from '../components/layout'

import rawQuestions from '../data/AZ-204_Final_Processed_Questions.json'

// ─── Question type detection ───────────────────────────────────────────────
function detectType(q) {
  const t = (q.question_text || '').trim()
  if (/^DRAG[\s_](?:AND[\s_])?DROP/i.test(t)) return 'drag_drop'
  if (/^HOTSPOT/i.test(t)) return 'hotspot'
  if (t.includes('part of a series of questions') || t.includes('identical set-up') || t.includes('number of questions that depicts')) return 'grouped'
  if (q.options && q.options.length > 0) {
    return q.correctAnswers && q.correctAnswers.length > 1 ? 'multi_select' : 'single_select'
  }
  return 'image_based'
}

// Strip community votes JSON from end of series question text
function stripVotes(text) {
  const match = text.match(/(\[[\s\S]*\])$/)
  if (!match) return { cleanText: text, votes: [] }
  try {
    const votes = JSON.parse(match[1])
    return { cleanText: text.slice(0, match.index).trim(), votes }
  } catch {
    return { cleanText: text, votes: [] }
  }
}

// The fixed boilerplate that appears in every series question
const SERIES_BOILERPLATE =
  'After you answer a question in this section, you will NOT be able to return to it. As a result, these questions will not appear in the review screen.'

// Parse a series question text into { scenario, solution }
function parseSeriesText(text) {
  const bpIdx = text.indexOf(SERIES_BOILERPLATE)
  const afterBp = bpIdx >= 0 ? text.slice(bpIdx + SERIES_BOILERPLATE.length).trim() : text

  const solIdx = afterBp.lastIndexOf('Solution:')
  if (solIdx === -1) return { scenario: afterBp, solution: '' }

  const scenario = afterBp.slice(0, solIdx).trim()
  const rest = afterBp.slice(solIdx + 'Solution:'.length).trim()
  const goalIdx = rest.toLowerCase().lastIndexOf('does the solution meet the goal?')
  const solution = goalIdx >= 0 ? rest.slice(0, goalIdx).trim() : rest

  return { scenario, solution }
}

// ─── Data preparation (two-pass to build series groups) ────────────────────

// Pass 1: detect types, parse series text
const _pass1 = rawQuestions.map((q, i) => {
  const type = detectType(q)
  let question_text = q.question_text || ''
  let communityVotes = [], scenario = '', solution = ''

  // Strip community votes JSON from all question types
  const { cleanText: strippedText, votes } = stripVotes(question_text)
  question_text = strippedText
  communityVotes = votes

  if (type === 'grouped') {
    const parsed = parseSeriesText(question_text)
    scenario = parsed.scenario
    solution = parsed.solution
  }

  return { ...q, question_text, communityVotes, question_type: type, sequential_number: i + 1, scenario, solution }
})

// Build series groups: scenario key (first 100 chars) → { id, total }
const _seriesMap = new Map()
let _seriesCounter = 0
_pass1.forEach(q => {
  if (q.question_type !== 'grouped') return
  const key = q.scenario.slice(0, 100)
  if (!_seriesMap.has(key)) _seriesMap.set(key, { id: ++_seriesCounter, indices: [] })
  _seriesMap.get(key).indices.push(q.sequential_number)
})

// Pass 2: build final QUESTIONS array
const QUESTIONS = _pass1.map(q => {
  const type = q.question_type
  let options = q.options || []
  let correctAnswers = q.correctAnswers || []
  let seriesId = null, seriesPosition = null, seriesTotal = null

  if (type === 'grouped') {
    // Series questions are always Yes / No (scraped options are wrong)
    options = [{ text: 'Yes — the solution meets the goal' }, { text: 'No — the solution does not meet the goal' }]
    // correct_answer letter: A = Yes (0), B = No (1)
    correctAnswers = q.correct_answer === 'A' ? [0] : q.correct_answer === 'B' ? [1] : correctAnswers

    const key = q.scenario.slice(0, 100)
    const group = _seriesMap.get(key)
    if (group) {
      seriesId = group.id
      seriesPosition = group.indices.indexOf(q.sequential_number) + 1
      seriesTotal = group.indices.length
    }
  }

  return {
    ...q,
    options,
    correctAnswers,
    seriesId, seriesPosition, seriesTotal,
    hasQuestionImages: Array.isArray(q.question_images) && q.question_images.length > 0,
    hasAnswerImages: Array.isArray(q.answer_images) && q.answer_images.length > 0,
    hasExplanation: !!(q.explanation && q.explanation.trim()),
    hasOptions: ['single_select', 'multi_select', 'grouped'].includes(type),
  }
})

// Render question text with the underlined phrase highlighted
const HighlightedQuestion = ({ text, phrase }) => {
  if (!phrase) return <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap mb-5">{text}</p>
  const idx = text.indexOf(phrase)
  if (idx === -1) return <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap mb-5">{text}</p>
  const before = text.slice(0, idx)
  const after  = text.slice(idx + phrase.length)
  return (
    <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap mb-5">
      {before}
      <span className="underline decoration-2 decoration-blue-600 font-semibold text-blue-800 bg-blue-50 px-0.5 rounded" title="This is the underlined portion to evaluate">
        {phrase}
      </span>
      {after}
    </p>
  )
}

const TYPE_LABELS = {
  all: 'All',
  single_select: 'Single Choice',
  multi_select: 'Multi Choice',
  hotspot: 'Hotspot',
  drag_drop: 'Drag & Drop',
  grouped: 'Series',
  image_based: 'Image Based',
}

const TYPE_COLORS = {
  single_select: 'bg-blue-100 text-blue-800',
  multi_select: 'bg-purple-100 text-purple-800',
  hotspot: 'bg-orange-100 text-orange-800',
  drag_drop: 'bg-teal-100 text-teal-800',
  grouped: 'bg-yellow-100 text-yellow-800',
  image_based: 'bg-gray-100 text-gray-800',
}

const getOptionLetter = (i) => String.fromCharCode(65 + i)

// ─── Sub-components ────────────────────────────────────────────────────────
const QuestionImage = ({ src, alt, badge }) => (
  <div className="relative">
    <img
      src={src}
      alt={alt}
      className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
      loading="lazy"
      onError={(e) => { e.target.parentElement.style.display = 'none' }}
    />
    {badge && (
      <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
        {badge}
      </span>
    )}
  </div>
)

const CommunityVotes = ({ votes }) => {
  if (!votes || votes.length === 0) return null
  const total = votes.reduce((s, v) => s + (v.vote_count || 0), 0)
  return (
    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-xs font-semibold text-yellow-800 mb-2">Community Votes</p>
      <div className="flex flex-wrap gap-2">
        {votes.map((v, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${v.is_most_voted ? 'bg-yellow-400 text-yellow-900' : 'bg-yellow-100 text-yellow-700'}`}
          >
            {v.voted_answers}
            <span className="opacity-70">({v.vote_count}/{total})</span>
            {v.is_most_voted && ' ★'}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────
const AZ204ExamPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAnswers, setSelectedAnswers] = useState({})  // { idx: number | number[] }
  const [showAnswers, setShowAnswers] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [goToPage, setGoToPage] = useState('')

  const questionsPerPage = 10

  const filteredQuestions = useMemo(() => {
    let list = QUESTIONS
    if (typeFilter !== 'all') list = list.filter(q => q.question_type === typeFilter)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(item =>
        item.question_text?.toLowerCase().includes(q) ||
        item.options?.some(o => o.text?.toLowerCase().includes(q)) ||
        item.explanation?.toLowerCase().includes(q)
      )
    }
    return list
  }, [searchQuery, typeFilter])

  // Reset to page 1 when filter/search changes
  useEffect(() => { setCurrentPage(1) }, [searchQuery, typeFilter])

  const { totalPages, startIndex, endIndex, currentQuestions } = useMemo(() => {
    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage)
    const startIndex = (currentPage - 1) * questionsPerPage
    const endIndex = startIndex + questionsPerPage
    return { totalPages, startIndex, endIndex, currentQuestions: filteredQuestions.slice(startIndex, endIndex) }
  }, [filteredQuestions, currentPage])

  const handleAnswerSelect = useCallback((globalIdx, optionIdx, isMulti) => {
    setSelectedAnswers(prev => {
      if (!isMulti) return { ...prev, [globalIdx]: optionIdx }
      const current = Array.isArray(prev[globalIdx]) ? prev[globalIdx] : []
      const next = current.includes(optionIdx)
        ? current.filter(i => i !== optionIdx)
        : [...current, optionIdx]
      return { ...prev, [globalIdx]: next }
    })
  }, [])

  const toggleAnswer = useCallback((globalIdx) => {
    setShowAnswers(prev => ({ ...prev, [globalIdx]: !prev[globalIdx] }))
  }, [])

  const changePage = (p) => {
    setCurrentPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGoToPage = (e) => {
    e.preventDefault()
    const p = parseInt(goToPage)
    if (p >= 1 && p <= totalPages) { changePage(p); setGoToPage('') }
  }

  // Type distribution for filter pills
  const typeCounts = useMemo(() => {
    const counts = { all: QUESTIONS.length }
    QUESTIONS.forEach(q => { counts[q.question_type] = (counts[q.question_type] || 0) + 1 })
    return counts
  }, [])

  return (
    <Layout pageTitle="AZ-204 Exam Questions">
      <Helmet>
        <title>AZ-204 Practice | Learning Lab</title>
        <meta name="description" content="AZ-204 Azure Developer Associate practice — hotspot, drag-drop, scenario series, and multiple choice with full explanations." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back to hub */}
          <div className="mb-6">
            <Link to="/learn" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Learning Lab
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">AZ-204 Exam Questions</h1>
            <p className="text-xl text-gray-600">Azure Developer Associate Certification Practice</p>
            <p className="text-sm text-gray-500 mt-1">{QUESTIONS.length} questions · hotspot · drag &amp; drop · series · multiple choice</p>
          </div>

          {/* Filter + Search bar */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            {/* Type filter pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(TYPE_LABELS).map(([key, label]) => (
                typeCounts[key] > 0 || key === 'all' ? (
                  <button
                    key={key}
                    onClick={() => setTypeFilter(key)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${typeFilter === key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {label} <span className="opacity-70">({typeCounts[key] || 0})</span>
                  </button>
                ) : null
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search questions, options, or explanations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Pagination controls */}
              <div className="flex items-center space-x-3">
                <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                <span className="text-gray-600 whitespace-nowrap">Page {currentPage} of {totalPages}</span>
                <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
                <form onSubmit={handleGoToPage} className="flex items-center space-x-2">
                  <input type="number" min="1" max={totalPages} value={goToPage}
                    onChange={e => setGoToPage(e.target.value)} placeholder="Go"
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm" />
                  <button type="submit" className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">Go</button>
                </form>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-500 text-center">
              Showing {startIndex + 1}–{Math.min(endIndex, filteredQuestions.length)} of {filteredQuestions.length} questions
            </p>
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {currentQuestions.map((question, qi) => {
              const globalIdx = startIndex + qi
              const showAnswer = !!showAnswers[globalIdx]
              const selected = selectedAnswers[globalIdx]
              const isMulti = question.question_type === 'multi_select'

              return (
                <div key={globalIdx} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Card header */}
                  <div className={`bg-gradient-to-r ${question.question_type === 'grouped' ? 'from-amber-500 to-yellow-500' : 'from-blue-600 to-indigo-600'} px-6 py-4`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-white font-semibold text-lg">Q{question.sequential_number}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${TYPE_COLORS[question.question_type]}`}>
                          {TYPE_LABELS[question.question_type]}
                        </span>
                        {question.question_type === 'grouped' && question.seriesId && (
                          <span className="bg-white/25 text-white px-2 py-0.5 rounded text-xs font-medium">
                            Series {question.seriesId} · {question.seriesPosition}/{question.seriesTotal}
                          </span>
                        )}
                        {isMulti && (
                          <span className="bg-white/20 text-white px-2 py-0.5 rounded text-xs">Select {question.correctAnswers?.length}</span>
                        )}
                        {question.hasQuestionImages && (
                          <span className="bg-white/20 text-white px-2 py-0.5 rounded text-xs">Has Image</span>
                        )}
                        {question.hasExplanation && (
                          <span className="bg-white/20 text-white px-2 py-0.5 rounded text-xs">Explained</span>
                        )}
                      </div>
                      <button onClick={() => toggleAnswer(globalIdx)}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                        {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
                      </button>
                    </div>
                  </div>

                  <div className="p-6">

                    {/* ── Series question layout ── */}
                    {question.question_type === 'grouped' ? (
                      <div className="space-y-4 mb-5">
                        {/* Shared scenario */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Scenario</p>
                          <p className="text-gray-800 text-sm leading-relaxed">{question.scenario}</p>
                        </div>

                        {/* Proposed solution */}
                        {question.solution && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Proposed Solution</p>
                            <p className="text-gray-800 text-base leading-relaxed font-medium">{question.solution}</p>
                          </div>
                        )}

                        {/* The actual question */}
                        <p className="text-gray-900 font-semibold text-base">Does this solution meet the goal?</p>
                      </div>
                    ) : (
                      <HighlightedQuestion text={question.question_text} phrase={question.underlined_phrase} />
                    )}

                    {/* Question images (always visible) */}
                    {question.hasQuestionImages && (
                      <div className="mb-5 space-y-3">
                        {question.question_images.map((url, ii) => (
                          <QuestionImage key={ii} src={url}
                            alt={`Q${question.sequential_number} image ${ii + 1}`}
                            badge={question.question_images.length > 1 ? `Image ${ii + 1}` : null} />
                        ))}
                      </div>
                    )}

                    {/* ── Drag & Drop ── show answer image on reveal only */}
                    {question.question_type === 'drag_drop' && (
                      <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg mb-4">
                        <p className="text-teal-800 text-sm font-medium">
                          Drag &amp; Drop — arrange the items shown in the question image above into the correct order/position.
                          {!showAnswer && ' Reveal the answer to see the correct arrangement.'}
                        </p>
                      </div>
                    )}

                    {/* ── Hotspot ── show info, skip options */}
                    {question.question_type === 'hotspot' && (
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg mb-4">
                        <p className="text-orange-800 text-sm font-medium">
                          Hotspot — click the correct areas in the image above.
                          {!showAnswer && ' Reveal the answer to see highlighted selections.'}
                        </p>
                      </div>
                    )}

                    {/* ── Image-based with no images ── incomplete data notice */}
                    {question.question_type === 'image_based' && !question.hasQuestionImages && !question.hasAnswerImages && (
                      <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg mb-4 flex items-start gap-3">
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 text-sm">
                          The answer options or diagram for this question were not captured during processing.
                          Reveal the answer to see the correct option letter.
                        </p>
                      </div>
                    )}

                    {/* ── Options (single / multi / series) ── */}
                    {question.hasOptions && (
                      <div className="space-y-2 mb-5">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          {isMulti ? `Select ${question.correctAnswers?.length} answers:` : 'Select your answer:'}
                        </p>
                        {question.options.map((option, oi) => {
                          const isSelected = isMulti
                            ? Array.isArray(selected) && selected.includes(oi)
                            : selected === oi
                          const isCorrect = question.correctAnswers?.includes(oi)

                          let cls = 'w-full text-left p-4 rounded-lg border-2 transition-all duration-200 '
                          if (showAnswer) {
                            if (isCorrect) cls += 'border-green-500 bg-green-50 text-green-800'
                            else if (isSelected) cls += 'border-red-400 bg-red-50 text-red-700'
                            else cls += 'border-gray-200 bg-gray-50 text-gray-500'
                          } else {
                            if (isSelected) cls += 'border-blue-500 bg-blue-50 text-blue-800'
                            else cls += 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
                          }

                          return (
                            <button key={oi} disabled={showAnswer}
                              onClick={() => handleAnswerSelect(globalIdx, oi, isMulti)}
                              className={cls}>
                              <div className="flex items-start gap-3">
                                {isMulti ? (
                                  /* Checkbox for multi-select */
                                  <span className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${isSelected && !showAnswer ? 'bg-blue-500 border-blue-500' : showAnswer && isCorrect ? 'bg-green-500 border-green-500' : showAnswer && isSelected ? 'bg-red-400 border-red-400' : 'border-current bg-white'}`}>
                                    {(isSelected || (showAnswer && isCorrect)) && (
                                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </span>
                                ) : (
                                  /* Radio circle for single-select */
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                                    {getOptionLetter(oi)}
                                  </span>
                                )}
                                <span className="flex-1 text-left">
                                  {isMulti && <span className="text-xs font-bold mr-2 opacity-60">{getOptionLetter(oi)}.</span>}
                                  {option.text}
                                </span>
                                {showAnswer && isCorrect && (
                                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                                {showAnswer && isSelected && !isCorrect && (
                                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* ── Answer section (on reveal) ── */}
                    {showAnswer && (
                      <div className="space-y-4 mt-2">
                        {/* Correct answer text */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold text-green-800">Correct Answer</span>
                          </div>
                          <p className="text-green-700">
                            {question.question_type === 'drag_drop' || question.question_type === 'hotspot'
                              ? 'See answer image below.'
                              : question.correctAnswers && question.correctAnswers.length > 0
                                ? question.correctAnswers.map(i => getOptionLetter(i)).join(', ')
                                : question.correct_answer || 'See answer image below.'}
                          </p>
                        </div>

                        {/* Answer images */}
                        {question.hasAnswerImages && (
                          <div className="space-y-3">
                            <p className="text-sm font-medium text-gray-600">Answer:</p>
                            {question.answer_images.map((url, ii) => (
                              <div key={ii} className="relative">
                                <img src={url}
                                  alt={`Q${question.sequential_number} answer ${ii + 1}`}
                                  className="max-w-full h-auto rounded-lg border-2 border-green-200 shadow-sm"
                                  loading="lazy"
                                  onError={e => { e.target.parentElement.style.display = 'none' }} />
                                <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                                  ✓ Answer
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Explanation */}
                        {question.hasExplanation && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-semibold text-blue-800">Explanation</span>
                            </div>
                            <p className="text-blue-700 leading-relaxed whitespace-pre-wrap">{question.explanation}</p>
                            {question.explanation_reference && question.explanation_reference !== 'N/A' && (
                              <div className="mt-3 pt-3 border-t border-blue-200">
                                <a href={question.explanation_reference} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  Microsoft Documentation
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Community votes (grouped/series questions) */}
                        <CommunityVotes votes={question.communityVotes} />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom pagination */}
          <div className="mt-10 bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium">
                  ← Previous
                </button>
                <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium">
                  Next →
                </button>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700">Page {currentPage} of {totalPages}</div>
                <div className="text-sm text-gray-500">{filteredQuestions.length} total questions</div>
              </div>
              <form onSubmit={handleGoToPage} className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Go to:</label>
                <input type="number" min="1" max={totalPages} value={goToPage}
                  onChange={e => setGoToPage(e.target.value)} placeholder={currentPage.toString()}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center" />
                <button type="submit" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Go</button>
              </form>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Session Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{filteredQuestions.length}</div>
                <div className="text-xs text-blue-700">Questions</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{Object.keys(selectedAnswers).length}</div>
                <div className="text-xs text-green-700">Attempted</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.values(showAnswers).filter(Boolean).length}
                </div>
                <div className="text-xs text-purple-700">Revealed</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {QUESTIONS.filter(q => q.hasExplanation).length}
                </div>
                <div className="text-xs text-orange-700">Explained</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
              {Object.entries(TYPE_LABELS).filter(([k]) => k !== 'all').map(([key, label]) => (
                typeCounts[key] ? (
                  <span key={key} className="flex items-center gap-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${key === 'single_select' ? 'bg-blue-400' : key === 'multi_select' ? 'bg-purple-400' : key === 'hotspot' ? 'bg-orange-400' : key === 'drag_drop' ? 'bg-teal-400' : key === 'grouped' ? 'bg-yellow-400' : 'bg-gray-400'}`} />
                    {typeCounts[key]} {label}
                  </span>
                ) : null
              ))}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default AZ204ExamPage
