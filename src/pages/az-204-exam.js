import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import Layout from '../components/layout'

// Import the processed local JSON data
import processedQuestions from '../data/AZ-204-Rewritten-Questions.json'

// AZ-204 Exam Questions Page with Enhanced Local Data
const AZ204ExamPage = () => {
  const [questions, setQuestions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showAnswers, setShowAnswers] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredQuestions, setFilteredQuestions] = useState([])
  const [goToPage, setGoToPage] = useState('')

  const questionsPerPage = 10

  // Load questions from local JSON data
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true)
        
        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500))

        // Use the imported processed questions data
        const enhancedQuestions = processedQuestions.map((question, index) => ({
          ...question,
          // Ensure proper question numbering
          question_number: `Q${(index + 1).toString().padStart(3, '0')}`,
          
          // Add metadata for UI features
          metadata: {
            hasMultipleAnswers: question.correctAnswers && Array.isArray(question.correctAnswers) && question.correctAnswers.length > 1,
            hasQuestionImages: question.question_images && question.question_images.length > 0,
            hasAnswerImages: question.answer_images && question.answer_images.length > 0,
            hasExplanation: question.explanation && question.explanation.trim() !== '',
            hasOptions: question.options && question.options.length > 0
          }
        }))

        console.log(`✅ Loaded ${enhancedQuestions.length} enhanced AZ-204 exam questions from local data`)
        setQuestions(enhancedQuestions)
        setFilteredQuestions(enhancedQuestions)
      } catch (err) {
        setError(`Failed to load questions: ${err.message}`)
        console.error('Error loading questions:', err)
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
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
        ) ||
        question.explanation?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredQuestions(filtered)
    }
    setCurrentPage(1) // Reset to first page when searching
  }, [searchQuery, questions])

  // Calculate pagination with memoization for performance
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage)
    const startIndex = (currentPage - 1) * questionsPerPage
    const endIndex = startIndex + questionsPerPage
    const currentQuestions = filteredQuestions.slice(startIndex, endIndex)

    return {
      totalPages,
      startIndex,
      endIndex,
      currentQuestions
    }
  }, [filteredQuestions, currentPage, questionsPerPage])

  const { totalPages, startIndex, endIndex, currentQuestions } = paginationData

  // Handle answer selection with useCallback for performance
  const handleAnswerSelect = useCallback((questionIndex, optionIndex) => {
    const globalQuestionIndex = startIndex + questionIndex
    setSelectedAnswers(prev => ({
      ...prev,
      [globalQuestionIndex]: optionIndex
    }))
  }, [startIndex])

  // Toggle answer visibility with useCallback for performance
  const toggleAnswers = useCallback((questionIndex) => {
    const globalQuestionIndex = startIndex + questionIndex
    setShowAnswers(prev => ({
      ...prev,
      [globalQuestionIndex]: !prev[globalQuestionIndex]
    }))
  }, [startIndex])

  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleGoToPage = (e) => {
    e.preventDefault()
    const pageNum = parseInt(goToPage)
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum)
      setGoToPage('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
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
              <p className="text-gray-600">Loading enhanced AZ-204 exam questions...</p>
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
        <meta name="description" content="Practice AZ-204 Azure Developer Associate exam questions with detailed explanations, answer images, and enhanced options." />
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
                {filteredQuestions.length} Enhanced Questions
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                Local Data
              </div>
            </div>
          </div>

          {/* Search and Navigation */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search questions, options, or explanations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Pagination Controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                <span className="text-gray-600 whitespace-nowrap">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
                
                {/* Go to Page */}
                <form onSubmit={handleGoToPage} className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={goToPage}
                    onChange={(e) => setGoToPage(e.target.value)}
                    placeholder="Page"
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    Go
                  </button>
                </form>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600 text-center">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredQuestions.length)} of {filteredQuestions.length} questions
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
                          {question.metadata?.hasQuestionImages && (
                            <span className="bg-green-500/20 text-green-200 px-2 py-1 rounded text-xs font-medium">
                              Images
                            </span>
                          )}
                          {question.metadata?.hasAnswerImages && (
                            <span className="bg-orange-500/20 text-orange-200 px-2 py-1 rounded text-xs font-medium">
                              Answer Image
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
                        {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
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
                    {question.metadata?.hasQuestionImages && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Question Images:</h4>
                        <div className="grid gap-4">
                          {question.question_images.map((imageUrl, imgIndex) => (
                            <div key={imgIndex} className="relative">
                              <img
                                src={imageUrl}
                                alt={`Question ${globalQuestionIndex + 1} - Image ${imgIndex + 1}`}
                                className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                  console.warn(`Failed to load image: ${imageUrl}`)
                                }}
                              />
                              <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                                Question
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Answer Options (only for questions with options) */}
                    {question.metadata?.hasOptions && (
                      <div className="space-y-3 mb-6">
                        <h4 className="text-sm font-medium text-gray-700">Answer Options:</h4>
                        {question.options.map((option, optionIndex) => {
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
                                <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                                  {getOptionLetter(optionIndex)}
                                </span>
                                <span className="flex-1 text-left">
                                  {option.text}
                                </span>
                                {showStatus && (
                                  <span className="flex-shrink-0">
                                    {isCorrect ? (
                                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    ) : isSelected ? (
                                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    ) : null}
                                  </span>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* Answer Images (shown on reveal) */}
                    {showAnswer && question.metadata?.hasAnswerImages && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Answer Images:</h4>
                        <div className="grid gap-4">
                          {question.answer_images.map((imageUrl, imgIndex) => (
                            <div key={imgIndex} className="relative">
                              <img
                                src={imageUrl}
                                alt={`Question ${globalQuestionIndex + 1} - Answer ${imgIndex + 1}`}
                                className="max-w-full h-auto rounded-lg border-2 border-green-200 shadow-sm"
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                  console.warn(`Failed to load answer image: ${imageUrl}`)
                                }}
                              />
                              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                                ✓ Answer
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Correct Answer Display */}
                    {showAnswer && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold text-green-800">Correct Answer:</span>
                        </div>
                        <p className="text-green-700">
                          {question.correctAnswers && question.correctAnswers.length > 0
                            ? question.correctAnswers.map(idx => getOptionLetter(idx)).join(', ')
                            : question.correct_answer || 'Not specified'}
                        </p>
                      </div>
                    )}

                    {/* Explanation */}
                    {showAnswer && question.metadata?.hasExplanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold text-blue-800">Explanation:</span>
                        </div>
                        <div className="text-blue-700 leading-relaxed mb-3">
                          {question.explanation}
                        </div>
                        {question.explanation_reference && (
                          <div className="pt-3 border-t border-blue-200">
                            <a
                              href={question.explanation_reference}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              <span>Microsoft Documentation</span>
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom Pagination */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  ← Previous
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Next →
                </button>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="text-sm text-gray-500">
                  {filteredQuestions.length} total questions
                </div>
              </div>
              
              <form onSubmit={handleGoToPage} className="flex items-center space-x-3">
                <label className="text-sm text-gray-600">Go to page:</label>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={goToPage}
                  onChange={(e) => setGoToPage(e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                  placeholder={currentPage.toString()}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go
                </button>
              </form>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Statistics</h3>
            
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
                  {filteredQuestions.filter(q => q.metadata?.hasExplanation).length}
                </div>
                <div className="text-sm text-orange-700">With Explanations</div>
              </div>
            </div>

            {/* Additional Statistics */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{filteredQuestions.filter(q => q.metadata?.hasAnswerImages).length} questions with answer images</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{filteredQuestions.filter(q => q.metadata?.hasOptions).length} questions with options</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span>Enhanced with local processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AZ204ExamPage
