import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Layout from '../components/layout'
import ExamQuestionImage from '../components/ExamQuestionImage'

// AZ-204 Exam Questions Page
const AZ204ExamPage = () => {
  const [questions, setQuestions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showAnswers, setShowAnswers] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredQuestions, setFilteredQuestions] = useState([])

  const questionsPerPage = 5
  const API_URL = 'https://examtopicsweb-dwgjfcfgdecucahz.northeurope-01.azurewebsites.net/api/Questions'

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        const response = await fetch(API_URL)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        // Enhance the data with proper question numbering and cleanup
        const enhancedQuestions = data.map((question, index) => ({
          ...question,
          // Add proper question numbering
          question_number: `Q${(index + 1).toString().padStart(3, '0')}`,

          // Clean up and standardize the question text
          question_text: question.question_text?.trim() || 'Question text not available',

          // Ensure options array exists and is properly formatted
          options: question.options || [],

          // Standardize correct answers - ensure it's always an array
          correctAnswers: Array.isArray(question.correctAnswers)
            ? question.correctAnswers
            : (question.correctAnswers ? [question.correctAnswers] : []),

          // Improve answer letter format
          correct_answer_display: question.correctAnswers && Array.isArray(question.correctAnswers)
            ? question.correctAnswers.map(idx => String.fromCharCode(65 + idx)).join(', ')
            : question.correct_answer || 'Not specified',

          // Clean up explanation
          explanation: question.explanation === null || question.explanation === 'null'
            ? null
            : question.explanation,

          // Ensure images array exists
          images: Array.isArray(question.images) ? question.images.filter(img => img && img.trim()) : [],

          // Add metadata
          metadata: {
            hasMultipleAnswers: question.correctAnswers && Array.isArray(question.correctAnswers) && question.correctAnswers.length > 1,
            hasImages: question.images && Array.isArray(question.images) && question.images.length > 0,
            hasExplanation: question.explanation && question.explanation !== null && question.explanation !== 'null'
          }
        }))

        console.log(`✅ Loaded and enhanced ${enhancedQuestions.length} AZ-204 exam questions`)
        setQuestions(enhancedQuestions)
        setFilteredQuestions(enhancedQuestions)
      } catch (err) {
        setError(`Failed to load questions: ${err.message}`)
        console.error('Error fetching questions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  // Filter questions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredQuestions(questions)
    } else {
      const filtered = questions.filter(question =>
        question.question_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.options?.some(option =>
          option.text?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      setFilteredQuestions(filtered)
    }
    setCurrentPage(1) // Reset to first page when searching
  }, [searchQuery, questions])

  // Calculate pagination
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage)
  const startIndex = (currentPage - 1) * questionsPerPage
  const endIndex = startIndex + questionsPerPage
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex)

  // Handle answer selection
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const globalQuestionIndex = startIndex + questionIndex
    setSelectedAnswers({
      ...selectedAnswers,
      [globalQuestionIndex]: optionIndex
    })
  }

  // Toggle answer visibility
  const toggleAnswers = (questionIndex) => {
    const globalQuestionIndex = startIndex + questionIndex
    setShowAnswers({
      ...showAnswers,
      [globalQuestionIndex]: !showAnswers[globalQuestionIndex]
    })
  }

  // Check if answer is correct
  const isAnswerCorrect = (questionIndex, selectedOption) => {
    const question = currentQuestions[questionIndex]
    if (!question || !question.correctAnswers) return false
    return question.correctAnswers.includes(selectedOption)
  }

  // Get option letter (A, B, C, D, etc.)
  const getOptionLetter = (index) => String.fromCharCode(65 + index)

  if (loading) {
    return (
      <Layout pageTitle="AZ-204 Exam Questions">
        <Helmet>
          <title>AZ-204 Exam Questions - Loading...</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading AZ-204 exam questions...</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout pageTitle="AZ-204 Exam Questions">
        <Helmet>
          <title>AZ-204 Exam Questions - Error</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-600 text-lg font-semibold mb-2">Error Loading Questions</div>
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout pageTitle="AZ-204 Exam Questions">
      <Helmet>
        <title>AZ-204 Exam Questions | Azure Developer Certification Practice</title>
        <meta name="description" content="Practice AZ-204 Azure Developer Associate exam questions with detailed explanations and answers." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AZ-204 Exam Questions
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Azure Developer Associate Certification Practice
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {filteredQuestions.length} Questions
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Live Data
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredQuestions.length)} of {filteredQuestions.length}
                </span>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-8">
            {currentQuestions.map((question, questionIndex) => {
              const globalQuestionIndex = startIndex + questionIndex
              const selectedAnswer = selectedAnswers[globalQuestionIndex]
              const showAnswer = showAnswers[globalQuestionIndex]

              return (
                <div key={globalQuestionIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Question Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-white font-semibold text-lg">
                          {question.question_number || `Question ${globalQuestionIndex + 1}`}
                        </h3>
                        <div className="flex space-x-2">
                          {question.metadata?.hasMultipleAnswers && (
                            <span className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs font-medium">
                              Multiple Choice
                            </span>
                          )}
                          {question.metadata?.hasImages && (
                            <span className="bg-green-500/20 text-green-200 px-2 py-1 rounded text-xs font-medium">
                              Images
                            </span>
                          )}
                          {question.metadata?.hasExplanation && (
                            <span className="bg-yellow-500/20 text-yellow-200 px-2 py-1 rounded text-xs font-medium">
                              Explained
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleAnswers(questionIndex)}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        {showAnswer ? 'Hide Answer' : 'Show Answer'}
                      </button>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="p-6">
                    <div className="prose max-w-none mb-6">
                      <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                        {question.question_text}
                      </p>
                    </div>

                    {/* Question Images */}
                    {question.images && question.images.length > 0 && (
                      <div className="mb-6">
                        <div className="grid gap-4">
                          {question.images.map((imageUrl, imgIndex) => (
                            <ExamQuestionImage
                              key={imgIndex}
                              questionNumber={globalQuestionIndex + 1}
                              imageIndex={imgIndex + 1}
                              originalUrl={imageUrl}
                              alt={`Question ${globalQuestionIndex + 1} - Image ${imgIndex + 1}`}
                              className="w-full"
                            />
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-gray-500 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Images are automatically optimized when available locally
                        </div>
                      </div>
                    )}

                    {/* Answer Options */}
                    <div className="space-y-3">
                      {question.options && question.options.map((option, optionIndex) => {
                        const isSelected = selectedAnswer === optionIndex
                        const isCorrect = question.correctAnswers && question.correctAnswers.includes(optionIndex)
                        const showStatus = showAnswer && (isSelected || isCorrect)

                        let optionClasses = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 "

                        if (showAnswer) {
                          if (isCorrect) {
                            optionClasses += "border-green-500 bg-green-50 text-green-800"
                          } else if (isSelected && !isCorrect) {
                            optionClasses += "border-red-500 bg-red-50 text-red-800"
                          } else {
                            optionClasses += "border-gray-200 bg-gray-50 text-gray-600"
                          }
                        } else {
                          if (isSelected) {
                            optionClasses += "border-blue-500 bg-blue-50 text-blue-800"
                          } else {
                            optionClasses += "border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700"
                          }
                        }

                        return (
                          <button
                            key={optionIndex}
                            onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                            className={optionClasses}
                            disabled={showAnswer}
                          >
                            <div className="flex items-start space-x-3">
                              <span className="font-bold text-lg flex-shrink-0">
                                {getOptionLetter(optionIndex)}.
                              </span>
                              <span className="flex-1 text-left">
                                {option.text}
                              </span>
                              {showStatus && (
                                <div className="flex-shrink-0">
                                  {isCorrect ? (
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : isSelected ? (
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  ) : null}
                                </div>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {/* Answer Explanation */}
                    {showAnswer && (
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                              Correct Answer{question.metadata?.hasMultipleAnswers ? 's' : ''}:
                              {question.metadata?.hasMultipleAnswers && (
                                <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                                  Multiple Choice
                                </span>
                              )}
                            </h4>
                            <p className="text-blue-800 mb-3">
                              <span className="font-semibold">
                                {question.correct_answer_display ||
                                 (question.correctAnswers && question.correctAnswers.length > 0 ?
                                   question.correctAnswers.map(i => getOptionLetter(i)).join(', ') :
                                   'Answer information not available')}
                              </span>
                            </p>

                            {/* Show the actual correct options */}
                            {question.correctAnswers && question.correctAnswers.length > 0 && (
                              <div className="mb-3">
                                {question.correctAnswers.map((correctIndex, idx) => (
                                  <div key={idx} className="text-sm text-green-700 bg-green-50 p-2 rounded mb-1">
                                    <span className="font-medium">{getOptionLetter(correctIndex)}.</span> {question.options[correctIndex]?.text || 'Option not available'}
                                  </div>
                                ))}
                              </div>
                            )}

                            {question.explanation && question.explanation.trim() && (
                              <div className="mt-3 pt-3 border-t border-blue-200">
                                <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                  Explanation:
                                </h5>
                                <div className="text-blue-700 text-sm leading-relaxed bg-blue-25 p-3 rounded">
                                  {question.explanation}
                                </div>
                              </div>
                            )}

                            {!question.explanation && (
                              <div className="mt-3 pt-3 border-t border-blue-200">
                                <p className="text-blue-600 text-sm italic">
                                  💡 No additional explanation available for this question.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="bg-white rounded-lg shadow-lg px-4 py-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </nav>
            </div>
          )}

          {/* Progress Summary */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Progress & Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{filteredQuestions.length}</div>
                <div className="text-sm text-blue-700">Total Questions</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Object.keys(selectedAnswers).length}
                </div>
                <div className="text-sm text-green-700">Questions Attempted</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(showAnswers).filter(key => showAnswers[key]).length}
                </div>
                <div className="text-sm text-purple-700">Answers Revealed</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredQuestions.filter(q => q.metadata?.hasMultipleAnswers).length}
                </div>
                <div className="text-sm text-orange-700">Multiple Choice</div>
              </div>
            </div>

            {/* Additional Statistics */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{filteredQuestions.filter(q => q.metadata?.hasImages).length} questions with images</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>{filteredQuestions.filter(q => q.metadata?.hasExplanation).length} questions with explanations</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span>Page {currentPage} of {totalPages}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AZ204ExamPage