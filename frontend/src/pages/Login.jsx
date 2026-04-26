import React, { useContext, useEffect, useState, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate, useLocation } from 'react-router-dom'
import { auth } from '../firebase'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import ProfileCompletionModal from '../components/ProfileCompletionModal'

const countryCodes = [
  { code: '+63', country: 'Philippines' },
  { code: '+1', country: 'United States' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+91', country: 'India' },
  { code: '+86', country: 'China' },
  { code: '+61', country: 'Australia' },
  { code: '+65', country: 'Singapore' },
  { code: '+60', country: 'Malaysia' },
  { code: '+62', country: 'Indonesia' },
  { code: '+66', country: 'Thailand' },
  { code: '+84', country: 'Vietnam' },
  { code: '+81', country: 'Japan' },
  { code: '+82', country: 'South Korea' },
  { code: '+852', country: 'Hong Kong' },
  { code: '+886', country: 'Taiwan' },
]

const Login = () => {

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' }
    
    let score = 0
    
    // Length check
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1  // lowercase
    if (/[A-Z]/.test(password)) score += 1  // uppercase
    if (/[0-9]/.test(password)) score += 1  // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score += 1  // special characters
    
    // Determine strength label and color
    if (score <= 2) {
      return { score, label: 'Weak', color: 'bg-red-500' }
    } else if (score <= 4) {
      return { score, label: 'Medium', color: 'bg-yellow-500' }
    } else {
      return { score, label: 'Strong', color: 'bg-green-500' }
    }
  }

  const passwordStrength = calculatePasswordStrength(password)

  // Contact number states
  const [countryCode, setCountryCode] = useState('+63')
  const [phoneNumber, setPhoneNumber] = useState('')

  // OTP states
  const [showOtpStep, setShowOtpStep] = useState(false)
  const [otp, setOtp] = useState('')
  const [confirmationResult, setConfirmationResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Login reCAPTCHA states
  const [showLoginRecaptcha, setShowLoginRecaptcha] = useState(false)
  const [loginRecaptchaVerified, setLoginRecaptchaVerified] = useState(false)

  // Sign Up reCAPTCHA states
  const [signupRecaptchaVerified, setSignupRecaptchaVerified] = useState(false)

  // Profile completion modal state
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [profileCompletionValue, setProfileCompletionValue] = useState(20)
  const showModalRef = useRef(false) // Ref for synchronous checks

  const navigate = useNavigate()
  const location = useLocation()
  const { backendUrl, token, setToken } = useContext(AppContext)
  const recaptchaContainerRef = useRef(null)
  const loginRecaptchaContainerRef = useRef(null)

  // Handle phone number input - remove non-digits and leading zeros
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '') // Remove non-digits
    value = value.replace(/^0+/, '') // Remove leading zeros
    setPhoneNumber(value)
  }

  // Send OTP using Firebase
  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 8) {
      toast.error('Please enter a valid phone number')
      return
    }

    setIsLoading(true)
    try {
      // Combine country code and phone number
      const finalPhone = `${countryCode}${phoneNumber}`
      console.log('Country code:', countryCode)
      console.log('Phone number:', phoneNumber)
      console.log('Final phone:', finalPhone)
      console.log('Phone length:', finalPhone.length)

      // Validate phone number format (E.164 format)
      if (!finalPhone.match(/^\+[1-9]\d{1,14}$/)) {
        toast.error('Invalid phone number format')
        setIsLoading(false)
        return
      }

      // Check if signup reCAPTCHA verifier is initialized
      if (!window.signupRecaptchaVerifier) {
        console.error('Signup reCAPTCHA verifier not initialized')
        toast.error('Please complete the reCAPTCHA verification first')
        setIsLoading(false)
        return
      }

      console.log('Sending OTP to Firebase with phone:', finalPhone)
      // Send OTP using the already-initialized reCAPTCHA verifier
      const confirmation = await signInWithPhoneNumber(auth, finalPhone, window.signupRecaptchaVerifier)
      setConfirmationResult(confirmation)
      setShowOtpStep(true)
      toast.success('OTP sent to your phone!')
    } catch (error) {
      console.error('Firebase OTP Error:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Full error details:', JSON.stringify(error, null, 2))

      // Clear signup verifier on error to allow retry
      if (window.signupRecaptchaVerifier) {
        try {
          await window.signupRecaptchaVerifier.clear()
        } catch (e) {
          console.log('Error clearing signup verifier:', e)
        }
        window.signupRecaptchaVerifier = null
      }
      // Reset verification state
      setSignupRecaptchaVerified(false)

      // Provide user-friendly error messages
      let errorMessage = 'Failed to send OTP. Please try again.'
      if (error.code === 'auth/invalid-app-credential') {
        errorMessage = 'Firebase configuration error. Please check API key restrictions in Firebase Console.'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please wait a few minutes and try again.'
      } else if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format. Please check your number.'
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Verify OTP using Firebase
  const verifyOTP = async () => {
    if (!otp || otp.length < 6) {
      toast.error('Please enter the OTP')
      return
    }

    setIsLoading(true)
    try {
      await confirmationResult.confirm(otp)
      toast.success('Phone verified successfully!')
      // Proceed with registration after OTP verification
      await registerUser()
    } catch (error) {
      console.error('Firebase Verify Error:', error)
      toast.error('Invalid OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate profile completion percentage
  const calculateProfileCompletion = (userData) => {
    if (!userData) return 0
    let totalFields = 6
    let filledFields = 0
    if (userData.name && userData.name.trim() !== '') filledFields++
    if (userData.email && userData.email.trim() !== '') filledFields++
    if (userData.phone && userData.phone !== '000000000') filledFields++
    if (userData.address && (userData.address.line1 || userData.address.line2)) filledFields++
    if (userData.gender && userData.gender !== 'Not Selected') filledFields++
    if (userData.dob && userData.dob !== 'Not Selected') filledFields++
    return Math.round((filledFields / totalFields) * 100)
  }

  // Register user after OTP verification
  const registerUser = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password, countryCode, phoneNumber })

      if (data.success) {
        localStorage.setItem('token', data.token)
        // Mark as new user and show profile completion modal FIRST
        setIsNewUser(true)
        // Calculate actual profile completion from returned user data
        const completion = calculateProfileCompletion(data.userData || { name, email, phone: phoneNumber ? `${countryCode}${phoneNumber}` : '000000000' })
        setProfileCompletionValue(completion)
        setShowProfileModal(true)
        showModalRef.current = true // Set ref before token to block navigation
        toast.success('Account created successfully!')
        setToken(data.token)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    }
  }

  // Initialize login reCAPTCHA on page load
  const initLoginRecaptcha = async () => {
    try {
      // Clear existing reCAPTCHA verifier
      if (window.loginRecaptchaVerifier) {
        try {
          await window.loginRecaptchaVerifier.clear()
        } catch (e) {
          console.log('Login reCAPTCHA clear error:', e)
        }
        window.loginRecaptchaVerifier = null
      }

      // Wait for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 300))

      // Check if container exists
      const container = document.getElementById('login-recaptcha-container')
      if (!container) {
        console.log('login-recaptcha-container not found, retrying...')
        return
      }

      // Initialize login reCAPTCHA with separate container
      window.loginRecaptchaVerifier = new RecaptchaVerifier(auth, 'login-recaptcha-container', {
        'size': 'normal',
        'callback': (response) => {
          console.log('Login reCAPTCHA verified:', response)
          setLoginRecaptchaVerified(true)
        },
        'expired-callback': () => {
          toast.error('reCAPTCHA expired. Please verify again.')
          setLoginRecaptchaVerified(false)
        }
      })

      // Render reCAPTCHA
      await window.loginRecaptchaVerifier.render()
      console.log('Login reCAPTCHA rendered successfully')
    } catch (error) {
      console.error('Login reCAPTCHA Error:', error)
    }
  }

  // Initialize signup reCAPTCHA on page load
  const initSignupRecaptcha = async () => {
    try {
      // Clear existing reCAPTCHA verifier
      if (window.signupRecaptchaVerifier) {
        try {
          await window.signupRecaptchaVerifier.clear()
        } catch (e) {
          console.log('Signup reCAPTCHA clear error:', e)
        }
        window.signupRecaptchaVerifier = null
      }

      // Wait for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 300))

      // Check if container exists
      const container = document.getElementById('recaptcha-container')
      if (!container) {
        console.log('recaptcha-container not found, retrying...')
        return
      }

      // Initialize signup reCAPTCHA
      window.signupRecaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'normal',
        'callback': (response) => {
          console.log('Signup reCAPTCHA verified:', response)
          setSignupRecaptchaVerified(true)
        },
        'expired-callback': () => {
          toast.error('reCAPTCHA expired. Please verify again.')
          setSignupRecaptchaVerified(false)
        }
      })

      // Render reCAPTCHA
      await window.signupRecaptchaVerifier.render()
      console.log('Signup reCAPTCHA rendered successfully')
    } catch (error) {
      console.error('Signup reCAPTCHA Error:', error)
    }
  }

  // Perform actual login after reCAPTCHA verification
  const performLogin = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        // Check if user has incomplete profile - will be handled by App.jsx
        sessionStorage.setItem('justLoggedIn', 'true')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Sign Up') {
      // Check password strength before proceeding
      if (passwordStrength.score <= 2) {
        toast.error('Please create a stronger password. Use 8+ characters with uppercase, lowercase, numbers, and symbols.')
        return
      }
      
      if (showOtpStep) {
        // Verify OTP
        await verifyOTP()
      } else {
        // Check if reCAPTCHA is verified before sending OTP
        if (!signupRecaptchaVerified) {
          toast.error('Please complete the reCAPTCHA verification first')
          return
        }
        // Send OTP first for phone verification
        await sendOTP()
      }
    } else {
      // Login flow - check if reCAPTCHA is verified
      if (!loginRecaptchaVerified) {
        toast.error('Please complete the reCAPTCHA verification first')
        return
      }
      // reCAPTCHA verified, proceed with login
      await performLogin()
    }
  }

  useEffect(() => {
    if (location.state === 'Login') {
      setState('Login')
    }
  }, [location.state])

  // Initialize reCAPTCHA when switching states
  useEffect(() => {
    if (state === 'Login') {
      initLoginRecaptcha()
    } else if (state === 'Sign Up') {
      initSignupRecaptcha()
    }
  }, [state])

  useEffect(() => {
    if (token) {
      // Don't navigate if showing profile modal for new user
      // Use ref for synchronous check since state might not be updated yet
      if (!showModalRef.current) {
        navigate('/')
      }
    }
  }, [token, navigate])

  useEffect(() => {
    // Listen for custom event to switch to Sign Up
    const handleSwitchToSignUp = () => {
      setState('Sign Up');
    };

    // Listen for custom event to switch to Login
    const handleSwitchToLogin = () => {
      setState('Login');
    };

    window.addEventListener('switchToSignUp', handleSwitchToSignUp);
    window.addEventListener('switchToLogin', handleSwitchToLogin);

    return () => {
      window.removeEventListener('switchToSignUp', handleSwitchToSignUp);
      window.removeEventListener('switchToLogin', handleSwitchToLogin);
    };
  }, [])

  // Reset form when switching states
  const handleSwitchState = (newState) => {
    setState(newState)
    setPhoneNumber('')
    setCountryCode('+63')
    setShowOtpStep(false)
    setOtp('')
    setConfirmationResult(null)
    // Reset reCAPTCHA states
    setShowLoginRecaptcha(false)
    setLoginRecaptchaVerified(false)
    setSignupRecaptchaVerified(false)
    // Reset new user state
    setIsNewUser(false)
    setShowProfileModal(false)
    showModalRef.current = false
    // Clear reCAPTCHA verifiers
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear()
      window.recaptchaVerifier = null
    }
    if (window.loginRecaptchaVerifier) {
      window.loginRecaptchaVerifier.clear()
      window.loginRecaptchaVerifier = null
    }
    if (window.signupRecaptchaVerifier) {
      window.signupRecaptchaVerifier.clear()
      window.signupRecaptchaVerifier = null
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center' autoComplete="off">
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-white/20 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-200 text-sm shadow-xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-lg'>
        {/* Hidden dummy fields to trick browser autofill */}
        <input type="text" style={{ display: 'none' }} autoComplete="off" />
        <input type="password" style={{ display: 'none' }} autoComplete="off" />
        
        <p className='text-2xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent dark:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>
        {state === 'Sign Up'
          ? <div className='w-full '>
            <p>Full Name</p>
            <input onChange={(e) => setName(e.target.value)} value={name} placeholder='e.g. Juan Dela Cruz' className='border border-blue-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white rounded w-full p-2 mt-1 focus:border-blue-400 focus:outline-none transition-colors' type="text" required autoComplete="off" />
          </div>
          : null
        }
        <div className='w-full '>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder='example@gmail.com' className='border border-blue-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white rounded w-full p-2 mt-1 focus:border-blue-400 focus:outline-none transition-colors' type="email" required autoComplete="nope" />
        </div>

        {/* Contact Number - Only for Sign Up */}
        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Contact Number</p>
            <div className='flex gap-2 mt-1'>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className='border border-blue-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white rounded p-2 focus:border-blue-400 focus:outline-none transition-colors bg-white'
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code} {country.country}
                  </option>
                ))}
              </select>
              <input
                onChange={handlePhoneChange}
                value={phoneNumber}
                className='border border-blue-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white rounded w-full p-2 focus:border-blue-400 focus:outline-none transition-colors'
                type="tel"
                required
              />
            </div>
          </div>
        )}

        <div className='w-full'>
          <p>Password</p>
          <div className='relative mt-1'>
            <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder={state === 'Sign Up' ? 'At least 8 characters' : 'Enter your password'} className='border border-blue-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white rounded w-full p-2 pr-10 focus:border-blue-400 focus:outline-none transition-colors' type={showPassword ? 'text' : 'password'} required autoComplete="nope" />
            <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors'>
              {showPassword ? (
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88' />
                </svg>
              ) : (
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z' />
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
              )}
            </button>
          </div>
          
          {/* Password Strength Indicator - Only for Sign Up */}
          {state === 'Sign Up' && password && (
            <div className='mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300'>
              <div className='flex items-center gap-2'>
                <div className='flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden shadow-inner'>
                  <div 
                    className={`h-full transition-all duration-500 ease-out ${passwordStrength.color} shadow-sm`}
                    style={{ 
                      width: `${(passwordStrength.score / 6) * 100}%`,
                      boxShadow: passwordStrength.score > 4 ? '0 0 8px rgba(34, 197, 94, 0.3)' : 
                               passwordStrength.score > 2 ? '0 0 8px rgba(234, 179, 8, 0.3)' : 
                               '0 0 8px rgba(239, 68, 68, 0.3)'
                    }}
                  ></div>
                </div>
                <span className={`text-xs font-semibold transition-all duration-300 transform ${
                  passwordStrength.label === 'Weak' ? 'text-red-500 scale-95' : 
                  passwordStrength.label === 'Medium' ? 'text-yellow-500 scale-100' : 
                  'text-green-500 scale-105'
                }`}>
                  {passwordStrength.label}
                </span>
              </div>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-2 transition-all duration-300'>
                Use 8+ characters with uppercase, lowercase, numbers, and symbols
              </p>
            </div>
          )}
        </div>

        {/* OTP Verification - Only for Sign Up after OTP is sent */}
        {state === 'Sign Up' && showOtpStep && (
          <div className='w-full'>
            <p>OTP Code</p>
            <input
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              value={otp}
              maxLength={6}
              placeholder='123456'
              className='border border-blue-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white rounded w-full p-2 mt-1 focus:border-blue-400 focus:outline-none transition-colors text-center text-lg tracking-widest'
              type="text"
              required
              autoFocus
            />
          </div>
        )}

        {/* reCAPTCHA container for Sign Up */}
        {state === 'Sign Up' && !showOtpStep && (
          <div className='w-full'>
            <p className='text-xs text-gray-500 mb-1'>Please complete the verification below</p>
            <div id="recaptcha-container" ref={recaptchaContainerRef} className='flex justify-center'></div>
          </div>
        )}

        {/* reCAPTCHA container for Login */}
        {state === 'Login' && (
          <div className='w-full'>
            <p className='text-xs text-gray-500 mb-1'>Please complete the verification below</p>
            <div id="login-recaptcha-container" ref={loginRecaptchaContainerRef} className='flex justify-center'></div>
          </div>
        )}

        <button
          type='submit'
          disabled={isLoading}
          className='bg-gradient-to-r from-blue-500 to-green-500 text-white w-full py-2 my-2 rounded-md text-base hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoading ? (state === 'Sign Up' ? (showOtpStep ? 'Verifying...' : 'Sending OTP...') : (showLoginRecaptcha ? 'Loading...' : 'Logging in...')) : (state === 'Sign Up' ? (showOtpStep ? 'Verify OTP' : 'Create') : 'Login')}
        </button>

        {/* Back to signup button - Only for Sign Up after OTP is sent */}
        {state === 'Sign Up' && showOtpStep && (
          <button
            type='button'
            onClick={() => setShowOtpStep(false)}
            className='text-blue-600 hover:text-blue-700 underline cursor-pointer transition-colors w-full text-center'
          >
            Back to signup
          </button>
        )}

        {state === 'Sign Up'
          ? <p>Already have an account? <span onClick={() => handleSwitchState('Login')} className='text-blue-600 hover:text-blue-700 underline cursor-pointer transition-colors dark:drop-shadow-[0_0_4px_rgba(59,130,246,0.4)]'>Login here</span></p>
          : <p>Create a new account? <span onClick={() => handleSwitchState('Sign Up')} className='text-blue-600 hover:text-blue-700 underline cursor-pointer transition-colors dark:drop-shadow-[0_0_4px_rgba(59,130,246,0.4)]'>Click here</span></p>
        }
        <p><span onClick={() => window.open('https://curalink-admin-xl5a.onrender.com/admin-login', '_blank')} className='text-green-600 hover:text-green-700 underline cursor-pointer transition-colors dark:drop-shadow-[0_0_4px_rgba(34,197,94,0.4)]'>Admin login</span> or <span onClick={() => window.open('https://curalink-admin-xl5a.onrender.com/doctor-login', '_blank')} className='text-blue-600 hover:text-blue-700 underline cursor-pointer transition-colors dark:drop-shadow-[0_0_4px_rgba(59,130,246,0.4)]'>Doctor login</span></p>
      </div>

      {/* Profile Completion Modal */}
      <ProfileCompletionModal 
        isOpen={showProfileModal} 
        onClose={() => {
          setShowProfileModal(false)
          showModalRef.current = false
          setIsNewUser(false)
          navigate('/')
        }} 
        onContinue={() => {
          setShowProfileModal(false)
          showModalRef.current = false
          setIsNewUser(false)
          navigate('/my-profile')
        }}
        profileCompletion={profileCompletionValue}
      />
    </form>
  )
}

export default Login