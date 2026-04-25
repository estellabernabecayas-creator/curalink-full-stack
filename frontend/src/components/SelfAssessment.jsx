import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { specialityData } from '../assets/assets'

// Assessment questions - each tied to specific specialties
const assessmentQuestions = [
  {
    id: 1,
    question: "How often have you felt physically unwell or experienced general body discomfort in the past 2 weeks?",
    options: [
      { text: "Not at all", score: { 'General physician': 0 } },
      { text: "Several days", score: { 'General physician': 1 } },
      { text: "More than half the days", score: { 'General physician': 2 } },
      { text: "Nearly every day", score: { 'General physician': 3 } }
    ]
  },
  {
    id: 2,
    question: "Are you experiencing any women's health related symptoms (irregular periods, pelvic pain, etc.)?",
    options: [
      { text: "No symptoms", score: { 'Gynecologist': 0 } },
      { text: "Mild symptoms occasionally", score: { 'Gynecologist': 1 } },
      { text: "Moderate symptoms frequently", score: { 'Gynecologist': 2 } },
      { text: "Severe symptoms regularly", score: { 'Gynecologist': 3 } }
    ]
  },
  {
    id: 3,
    question: "How would you rate your skin health? Any persistent rashes, acne, or skin conditions?",
    options: [
      { text: "Skin is healthy", score: { 'Dermatologist': 0 } },
      { text: "Minor occasional issues", score: { 'Dermatologist': 1 } },
      { text: "Moderate persistent problems", score: { 'Dermatologist': 2 } },
      { text: "Severe ongoing skin conditions", score: { 'Dermatologist': 3 } }
    ]
  },
  {
    id: 4,
    question: "Do you have any concerns about your child's health, growth, or development?",
    options: [
      { text: "No concerns", score: { 'Pediatricians': 0 } },
      { text: "Minor concerns", score: { 'Pediatricians': 1 } },
      { text: "Moderate concerns", score: { 'Pediatricians': 2 } },
      { text: "Significant concerns", score: { 'Pediatricians': 3 } }
    ]
  },
  {
    id: 5,
    question: "Have you experienced frequent headaches, migraines, or neurological symptoms?",
    options: [
      { text: "Never/Rarely", score: { 'Neurologist': 0 } },
      { text: "Occasionally", score: { 'Neurologist': 1 } },
      { text: "Frequently", score: { 'Neurologist': 2 } },
      { text: "Almost daily", score: { 'Neurologist': 3 } }
    ]
  },
  {
    id: 6,
    question: "How often do you experience digestive issues (bloating, stomach pain, irregular bowel movements)?",
    options: [
      { text: "Rarely/Never", score: { 'Gastroenterologist': 0 } },
      { text: "Sometimes", score: { 'Gastroenterologist': 1 } },
      { text: "Often", score: { 'Gastroenterologist': 2 } },
      { text: "Very frequently", score: { 'Gastroenterologist': 3 } }
    ]
  },
  {
    id: 7,
    question: "Do you have persistent fever, unexplained weight changes, or chronic fatigue?",
    options: [
      { text: "None of these", score: { 'General physician': 0 } },
      { text: "One mild symptom", score: { 'General physician': 1 } },
      { text: "Multiple moderate symptoms", score: { 'General physician': 2 } },
      { text: "Severe/multiple symptoms", score: { 'General physician': 3 } }
    ]
  },
  {
    id: 8,
    question: "Are you experiencing reproductive health concerns or planning for pregnancy?",
    options: [
      { text: "No concerns", score: { 'Gynecologist': 0 } },
      { text: "General questions", score: { 'Gynecologist': 1 } },
      { text: "Active concerns", score: { 'Gynecologist': 2 } },
      { text: "Urgent reproductive health issues", score: { 'Gynecologist': 3 } }
    ]
  },
  {
    id: 9,
    question: "Have you noticed any unusual changes in your skin, hair, or nails?",
    options: [
      { text: "No changes", score: { 'Dermatologist': 0 } },
      { text: "Minor cosmetic concerns", score: { 'Dermatologist': 1 } },
      { text: "Noticeable changes", score: { 'Dermatologist': 2 } },
      { text: "Significant medical concerns", score: { 'Dermatologist': 3 } }
    ]
  },
  {
    id: 10,
    question: "Does your child need routine check-ups, vaccinations, or developmental screening?",
    options: [
      { text: "Up to date on all", score: { 'Pediatricians': 0 } },
      { text: "Minor catch-up needed", score: { 'Pediatricians': 1 } },
      { text: "Several missed appointments", score: { 'Pediatricians': 2 } },
      { text: "Urgent care needed", score: { 'Pediatricians': 3 } }
    ]
  },
  {
    id: 11,
    question: "Do you experience numbness, tingling, memory issues, or difficulty concentrating?",
    options: [
      { text: "Never", score: { 'Neurologist': 0 } },
      { text: "Rarely", score: { 'Neurologist': 1 } },
      { text: "Sometimes", score: { 'Neurologist': 2 } },
      { text: "Often affecting daily life", score: { 'Neurologist': 3 } }
    ]
  },
  {
    id: 12,
    question: "Have you noticed blood in stool, persistent heartburn, or difficulty swallowing?",
    options: [
      { text: "None of these", score: { 'Gastroenterologist': 0 } },
      { text: "Mild occasional issues", score: { 'Gastroenterologist': 1 } },
      { text: "Regular discomfort", score: { 'Gastroenterologist': 2 } },
      { text: "Severe/Alarming symptoms", score: { 'Gastroenterologist': 3 } }
    ]
  },
  {
    id: 13,
    question: "Do you need preventive health screening, annual check-up, or general health advice?",
    options: [
      { text: "Recently completed", score: { 'General physician': 0 } },
      { text: "Due soon", score: { 'General physician': 1 } },
      { text: "Overdue", score: { 'General physician': 2 } },
      { text: "Multiple concerns to discuss", score: { 'General physician': 3 } }
    ]
  },
  {
    id: 14,
    question: "Are you experiencing any hormonal imbalances, mood swings related to cycle, or sexual health concerns?",
    options: [
      { text: "No issues", score: { 'Gynecologist': 0 } },
      { text: "Minor manageable", score: { 'Gynecologist': 1 } },
      { text: "Moderate affecting life", score: { 'Gynecologist': 2 } },
      { text: "Severe distress", score: { 'Gynecologist': 3 } }
    ]
  },
  {
    id: 15,
    question: "Do you have concerns about moles, skin cancer screening, or chronic skin conditions?",
    options: [
      { text: "No concerns", score: { 'Dermatologist': 0 } },
      { text: "Routine screening due", score: { 'Dermatologist': 1 } },
      { text: "Suspicious changes noticed", score: { 'Dermatologist': 2 } },
      { text: "Urgent dermatological issues", score: { 'Dermatologist': 3 } }
    ]
  }
]

const SelfAssessment = () => {
  const navigate = useNavigate()
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [scores, setScores] = useState({
    'General physician': 0,
    'Gynecologist': 0,
    'Dermatologist': 0,
    'Pediatricians': 0,
    'Neurologist': 0,
    'Gastroenterologist': 0
  })
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (option) => {
    // Update scores based on answer
    const newScores = { ...scores }
    Object.entries(option.score).forEach(([specialty, points]) => {
      newScores[specialty] += points
    })
    setScores(newScores)

    // Move to next question or show results
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const getRecommendedSpecialty = () => {
    // Find specialty with highest score
    let maxScore = -1
    let recommendedSpecialty = ''
    
    Object.entries(scores).forEach(([specialty, score]) => {
      if (score > maxScore) {
        maxScore = score
        recommendedSpecialty = specialty
      }
    })
    
    return { specialty: recommendedSpecialty, score: maxScore }
  }

  const getSpecialtyIcon = (specialty) => {
    const found = specialityData.find(s => s.speciality === specialty)
    return found ? found.image : null
  }

  const resetAssessment = () => {
    setStarted(false)
    setCurrentQuestion(0)
    setScores({
      'General physician': 0,
      'Gynecologist': 0,
      'Dermatologist': 0,
      'Pediatricians': 0,
      'Neurologist': 0,
      'Gastroenterologist': 0
    })
    setShowResults(false)
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

  // Results Screen
  if (showResults) {
    const recommendation = getRecommendedSpecialty()
    const specialtyImage = getSpecialtyIcon(recommendation.specialty)
    
    return (
      <section className='py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 via-white to-blue-50/50 dark:from-emerald-900/10 dark:via-slate-900 dark:to-blue-900/10'>
        <div className='max-w-2xl mx-auto'>
          <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden'>
            <div className='bg-gradient-to-r from-emerald-500 to-blue-600 p-5 text-center'>
              <h2 className='text-xl font-bold text-white mb-1'>Your Results</h2>
              <p className='text-emerald-100 text-sm'>Recommended specialist:</p>
            </div>
            
            <div className='p-5 sm:p-6'>
              {/* Recommended Specialty */}
              <div className='text-center mb-6'>
                <div className='w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 rounded-xl flex items-center justify-center shadow-md'>
                  {specialtyImage && (
                    <img src={specialtyImage} alt={recommendation.specialty} className='w-10 h-10 object-contain' />
                  )}
                </div>
                <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1'>
                  {recommendation.specialty}
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Best match for your health concerns
                </p>
              </div>

              {/* Score Breakdown */}
              <div className='mb-5 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl'>
                <h4 className='text-sm font-semibold text-gray-800 dark:text-white mb-3 text-center'>Match Score</h4>
                <div className='space-y-2'>
                  {Object.entries(scores)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3)
                    .map(([specialty, score]) => (
                      <div key={specialty} className='flex items-center gap-2'>
                        <span className='w-28 text-xs text-gray-600 dark:text-gray-400 truncate'>{specialty}</span>
                        <div className='flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden'>
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              specialty === recommendation.specialty 
                                ? 'bg-gradient-to-r from-emerald-500 to-blue-500' 
                                : 'bg-gray-400 dark:bg-gray-500'
                            }`}
                            style={{ width: `${Math.min((score / 9) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                <button
                  onClick={() => navigate(`/doctors/${recommendation.specialty}`)}
                  className='px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-sm'
                >
                  Find {recommendation.specialty} Doctors
                </button>
                <button
                  onClick={resetAssessment}
                  className='px-6 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm'
                >
                  Retake
                </button>
              </div>

              <p className='mt-4 text-xs text-gray-500 dark:text-gray-400 text-center'>
                For informational purposes only. Consult a healthcare provider for medical advice.
              </p>
            </div>
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
          {/* Progress Header */}
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
            {/* Progress Bar */}
            <div className='bg-white/20 rounded-full h-1.5 overflow-hidden'>
              <div 
                className='bg-white h-full rounded-full transition-all duration-500 ease-out'
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className='p-5 sm:p-6'>
            {/* Question */}
            <h3 className='text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-5 leading-relaxed'>
              {question.question}
            </h3>

            {/* Options */}
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
                      {option.text}
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
