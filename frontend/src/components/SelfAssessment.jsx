import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { specialityData } from '../assets/assets'
import { toast } from 'react-toastify'

const backendUrl = import.meta.env.VITE_BACKEND_URL

const assessmentQuestions = [
  {
    id: 1,
    question: "How often have you felt physically unwell or experienced general body discomfort in the past 2 weeks?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  },
  {
    id: 2,
    question: "Are you experiencing any women's health related symptoms (irregular periods, pelvic pain, etc.)?",
    options: ["No symptoms", "Mild symptoms occasionally", "Moderate symptoms frequently", "Severe symptoms regularly"]
  },
  {
    id: 3,
    question: "How would you rate your skin health? Any persistent rashes, acne, or skin conditions?",
    options: ["Skin is healthy", "Minor occasional issues", "Moderate persistent problems", "Severe ongoing skin conditions"]
  },
  {
    id: 4,
    question: "Do you have any concerns about your child's health, growth, or development?",
    options: ["No concerns", "Minor concerns", "Moderate concerns", "Significant concerns"]
  },
  {
    id: 5,
    question: "Have you experienced frequent headaches, migraines, or neurological symptoms?",
    options: ["Never/Rarely", "Occasionally", "Frequently", "Almost daily"]
  },
  {
    id: 6,
    question: "How often do you experience digestive issues (bloating, stomach pain, irregular bowel movements)?",
    options: ["Rarely/Never", "Sometimes", "Often", "Very frequently"]
  },
  {
    id: 7,
    question: "Do you have persistent fever, unexplained weight changes, or chronic fatigue?",
    options: ["None of these", "One mild symptom", "Multiple moderate symptoms", "Severe/multiple symptoms"]
  },
  {
    id: 8,
    question: "Are you experiencing reproductive health concerns or planning for pregnancy?",
    options: ["No concerns", "General questions", "Active concerns", "Urgent reproductive health issues"]
  },
  {
    id: 9,
    question: "Have you noticed any unusual changes in your skin, hair, or nails?",
    options: ["No changes", "Minor cosmetic concerns", "Noticeable changes", "Significant medical concerns"]
  },
  {
    id: 10,
    question: "Does your child need routine check-ups, vaccinations, or developmental screening?",
    options: ["Up to date on all", "Minor catch-up needed", "Several missed appointments", "Urgent care needed"]
  },
  {
    id: 11,
    question: "Do you experience numbness, tingling, memory issues, or difficulty concentrating?",
    options: ["Never", "Rarely", "Sometimes", "Often affecting daily life"]
  },
  {
    id: 12,
    question: "Have you noticed blood in stool, persistent heartburn, or difficulty swallowing?",
    options: ["None of these", "Mild occasional issues", "Regular discomfort", "Severe/Alarming symptoms"]
  },
  {
    id: 13,
    question: "Do you need preventive health screening, annual check-up, or general health advice?",
    options: ["Recently completed", "Due soon", "Overdue", "Multiple concerns to discuss"]
  },
  {
    id: 14,
    question: "Are you experiencing any hormonal imbalances, mood swings related to cycle, or sexual health concerns?",
    options: ["No issues", "Minor manageable", "Moderate affecting life", "Severe distress"]
  },
  {
    id: 15,
    question: "Do you have concerns about moles, skin cancer screening, or chronic skin conditions?",
    options: ["No concerns", "Routine screening due", "Suspicious changes noticed", "Urgent dermatological issues"]
  }
]

const SelfAssessment = () => {
  const navigate = useNavigate()
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  const handleAnswer = (answerText) => {
    const newAnswers = [...answers, { question: assessmentQuestions[currentQuestion].question, answer: answerText }]
    setAnswers(newAnswers)

    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      submitAssessment(newAnswers)
    }
  }

  const submitAssessment = async (finalAnswers) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${backendUrl}/api/self-assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers })
      })
      const data = await res.json()
      if (data.success) {
        setResult(data.recommendation)
      } else {
        setError(data.message || 'Something went wrong.')
        toast.error(data.message || 'Assessment failed.')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetAssessment = () => {
    setStarted(false)
    setCurrentQuestion(0)
    setAnswers([])
    setResult(null)
    setError(null)
    setShowChat(false)
    setChatMessages([])
    setChatInput('')
  }

  const getSpecialtyIcon = (specialty) => {
    const found = specialityData.find(s => s.speciality === specialty)
    return found ? found.image : null
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }])
    setChatLoading(true)
    try {
      const res = await fetch(`${backendUrl}/api/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, recommendation: result, message: userMsg })
      })
      const data = await res.json()
      if (data.success) {
        setChatMessages(prev => [...prev, { sender: 'ai', text: data.reply }])
      } else {
        toast.error(data.message || 'Chat error.')
      }
    } catch (err) {
      toast.error('Network error. Please try again.')
    } finally {
      setChatLoading(false)
    }
  }

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100

  // Welcome Screen
  if (!started) {
    return (
      <section className='py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 via-white to-blue-50/50 dark:from-emerald-900/10 dark:via-slate-900 dark:to-blue-900/10'>
        <div className='max-w-2xl mx-auto'>
          <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden'>
            <div className='bg-gradient-to-r from-emerald-500 to-blue-600 p-5 text-center'>
              <div className='w-12 h-12 mx-auto mb-2 bg-white/20 backdrop-blur rounded-full flex items-center justify-center'>
                <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' />
                </svg>
              </div>
              <h2 className='text-xl sm:text-2xl font-bold text-white mb-1'>Health Self-Assessment</h2>
              <p className='text-emerald-100 text-sm'>Find the right specialist</p>
            </div>
            <div className='p-5 sm:p-6'>
              <div className='text-center mb-5'>
                <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4'>
                  Answer {assessmentQuestions.length} quick questions to find the best specialist for your needs.
                </p>
                <div className='flex flex-wrap justify-center gap-3 text-xs text-gray-500 dark:text-gray-400'>
                  <span className='flex items-center gap-1'>
                    <svg className='w-3 h-3 text-emerald-500' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                    </svg>
                    2-3 minutes
                  </span>
                  <span className='flex items-center gap-1'>
                    <svg className='w-3 h-3 text-emerald-500' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
                    </svg>
                    Private
                  </span>
                </div>
              </div>
              <button
                onClick={() => setStarted(true)}
                className='w-full sm:w-auto mx-auto block px-8 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm'
              >
                Begin Assessment
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Loading Screen
  if (loading) {
    return (
      <section className='py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 via-white to-blue-50/50 dark:from-emerald-900/10 dark:via-slate-900 dark:to-blue-900/10'>
        <div className='max-w-2xl mx-auto'>
          <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center'>
            <div className='w-12 h-12 mx-auto mb-4 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin' />
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-1'>Analyzing your responses...</h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>Our AI is finding the best specialist for you.</p>
          </div>
        </div>
      </section>
    )
  }

  // Results Screen
  if (result) {
    const specialtyImage = getSpecialtyIcon(result.recommendedSpecialization)
    return (
      <section className='py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 via-white to-blue-50/50 dark:from-emerald-900/10 dark:via-slate-900 dark:to-blue-900/10'>
        <div className='max-w-2xl mx-auto space-y-4'>
          <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden'>
            <div className='bg-gradient-to-r from-emerald-500 to-blue-600 p-5 text-center'>
              <h2 className='text-xl font-bold text-white mb-1'>Your Results</h2>
              <p className='text-emerald-100 text-sm'>AI-recommended specialist</p>
            </div>
            <div className='p-5 sm:p-6'>
              <div className='text-center mb-6'>
                <div className='w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 rounded-xl flex items-center justify-center shadow-md'>
                  {specialtyImage && (
                    <img src={specialtyImage} alt={result.recommendedSpecialization} className='w-10 h-10 object-contain' />
                  )}
                </div>
                <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1'>
                  {result.recommendedSpecialization}
                </h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  result.confidence === 'High'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : result.confidence === 'Moderate'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {result.confidence} Confidence
                </span>
              </div>

              <div className='mb-5 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl'>
                <h4 className='text-sm font-semibold text-gray-800 dark:text-white mb-2'>Why this recommendation?</h4>
                <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>{result.reason}</p>
              </div>

              <div className='mb-5 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800'>
                <p className='text-xs text-blue-700 dark:text-blue-300 text-center font-medium'>
                  {result.disclaimer}
                </p>
              </div>

              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                <button
                  onClick={() => navigate(`/doctors/${result.recommendedSpecialization}`)}
                  className='px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm'
                >
                  Find {result.recommendedSpecialization} Doctors
                </button>
                <button
                  onClick={resetAssessment}
                  className='px-6 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm'
                >
                  Retake
                </button>
                <button
                  onClick={() => setShowChat(true)}
                  className='px-6 py-2.5 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-semibold rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-sm'
                >
                  Ask Follow-up
                </button>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          {showChat && (
            <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden'>
              <div className='p-4 border-b border-gray-100 dark:border-slate-700'>
                <h3 className='text-sm font-semibold text-gray-800 dark:text-white'>Ask about your recommendation</h3>
                <p className='text-xs text-gray-500 dark:text-gray-400'>The assistant can explain your result but will not diagnose or prescribe.</p>
              </div>
              <div className='p-4 h-64 overflow-y-auto space-y-3 bg-gray-50 dark:bg-slate-900/30'>
                {chatMessages.length === 0 && (
                  <p className='text-xs text-gray-400 dark:text-gray-500 text-center'>Type a question to start the conversation.</p>
                )}
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-600 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className='flex justify-start'>
                    <div className='bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl rounded-bl-none px-3 py-2 text-sm text-gray-500 dark:text-gray-400'>
                      <span className='inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce mr-0.5' />
                      <span className='inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce mr-0.5' style={{ animationDelay: '0.15s' }} />
                      <span className='inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                )}
              </div>
              <div className='p-3 border-t border-gray-100 dark:border-slate-700 flex gap-2'>
                <input
                  type='text'
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder='Ask a follow-up question...'
                  className='flex-1 px-4 py-2 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full outline-none focus:border-emerald-400 dark:focus:border-emerald-500 text-gray-800 dark:text-white'
                />
                <button
                  onClick={sendChatMessage}
                  disabled={chatLoading}
                  className='px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white text-sm font-medium rounded-full hover:from-emerald-600 hover:to-blue-700 transition-all disabled:opacity-50'
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }

  // Error fallback
  if (error) {
    return (
      <section className='py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 via-white to-blue-50/50 dark:from-emerald-900/10 dark:via-slate-900 dark:to-blue-900/10'>
        <div className='max-w-2xl mx-auto'>
          <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center'>
            <div className='w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center'>
              <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z' />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-2'>Something went wrong</h3>
            <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>{error}</p>
            <button
              onClick={resetAssessment}
              className='px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm'
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Question Screen
  const question = assessmentQuestions[currentQuestion]
  return (
    <section className='py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 via-white to-blue-50/50 dark:from-emerald-900/10 dark:via-slate-900 dark:to-blue-900/10'>
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden'>
          <div className='bg-gradient-to-r from-emerald-500 to-blue-600 p-4'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-emerald-100 text-xs font-medium'>Question {currentQuestion + 1} of {assessmentQuestions.length}</span>
              <button
                onClick={resetAssessment}
                className='text-white/80 hover:text-white text-xs underline'
              >
                Exit
              </button>
            </div>
            <div className='bg-white/20 rounded-full h-1.5 overflow-hidden'>
              <div
                className='bg-white h-full rounded-full transition-all duration-500 ease-out'
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className='p-5 sm:p-6'>
            <h3 className='text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-5 leading-relaxed'>
              {question.question}
            </h3>
            <div className='space-y-2'>
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className='w-full p-3 text-left bg-gray-50 dark:bg-slate-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-gray-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-700 rounded-lg transition-all duration-300 group text-sm'
                >
                  <div className='flex items-center gap-3'>
                    <div className='w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-600 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors'>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className='text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'>
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SelfAssessment
