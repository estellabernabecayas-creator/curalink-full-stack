import React, { useEffect, useRef, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const VideoConsultation = () => {
    const { appointmentId } = useParams()
    const { backendUrl, token, userData } = useContext(AppContext)
    const navigate = useNavigate()
    const jitsiRef = useRef(null)
    const [loading, setLoading] = useState(true)
    const [appointment, setAppointment] = useState(null)
    const [error, setError] = useState(null)

    // Fetch appointment details
    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const { data } = await axios.post(
                    backendUrl + '/api/user/get-appointment',
                    { appointmentId },
                    { headers: { token } }
                )

                if (data.success) {
                    setAppointment(data.appointment)
                    
                    // Check if it's an online consultation
                    if (data.appointment.consultationType !== 'online') {
                        setError('This is not an online consultation. Video calls are only available for online appointments.')
                        setLoading(false)
                        return
                    }

                    // Check if appointment is still valid (not cancelled)
                    if (data.appointment.cancelled) {
                        setError('This appointment has been cancelled.')
                        setLoading(false)
                        return
                    }

                    setLoading(false)
                } else {
                    setError(data.message || 'Failed to fetch appointment details')
                    setLoading(false)
                }
            } catch (error) {
                console.error('Error fetching appointment:', error)
                setError('Failed to load appointment details. Please try again.')
                setLoading(false)
            }
        }

        if (token && appointmentId) {
            fetchAppointment()
        }
    }, [appointmentId, backendUrl, token])

    // Initialize Jitsi Meet
    useEffect(() => {
        if (!appointment || !appointment.meetingId || loading || error) return

        // Check if Jitsi Meet API is available
        if (!window.JitsiMeetExternalAPI) {
            // Load Jitsi Meet script dynamically
            const jitsiDomain = import.meta.env.VITE_JITSI_DOMAIN || 'meet.jit.si'
            const script = document.createElement('script')
            script.src = `https://${jitsiDomain}/external_api.js`
            script.async = true
            script.onload = initJitsi
            script.onerror = () => {
                setError('Failed to load video call service. Please check your internet connection.')
            }
            document.body.appendChild(script)

            return () => {
                document.body.removeChild(script)
            }
        } else {
            initJitsi()
        }
    }, [appointment, loading, error])

    const initJitsi = () => {
        if (!jitsiRef.current || !appointment) return

        // Use custom Jitsi server if configured, otherwise fall back to public server
        const domain = import.meta.env.VITE_JITSI_DOMAIN || 'meet.jit.si'
        const options = {
            roomName: appointment.meetingId,
            parentNode: jitsiRef.current,
            width: '100%',
            height: '100%',
            configOverwrite: {
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                prejoinPageEnabled: false,
                enableLobby: false,
                disableModeratorIndicator: true,
                enableNoisyMicDetection: false,
                p2p: { enabled: true },
                security: { enabled: false },
            },
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'closedcaptions', 'desktop', 'embedmeeting',
                    'fullscreen', 'fodeviceselection', 'hangup', 'profile', 'chat',
                    'recording', 'livestreaming', 'etherpad', 'sharedvideo', 'shareaudio',
                    'settings', 'raisehand', 'videoquality', 'filmstrip', 'invite',
                    'feedback', 'stats', 'shortcuts', 'tileview', 'videobackgroundblur',
                    'download', 'help', 'mute-everyone', 'mute-video-everyone', 'security'
                ],
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                DEFAULT_BACKGROUND: '#5F8D4E',
            },
            userInfo: {
                displayName: userData?.name || 'Patient',
            }
        }

        try {
            const api = new window.JitsiMeetExternalAPI(domain, options)

            // Handle events
            api.addEventListeners({
                readyToClose: () => {
                    toast.info('Video call ended')
                    navigate('/my-appointments')
                },
                participantJoined: (participant) => {
                    console.log('Participant joined:', participant)
                },
                participantLeft: (participant) => {
                    console.log('Participant left:', participant)
                },
                videoConferenceJoined: () => {
                    toast.success('You have joined the consultation room')
                },
                videoConferenceLeft: () => {
                    console.log('Left the conference')
                }
            })
        } catch (err) {
            console.error('Error initializing Jitsi:', err)
            setError('Failed to initialize video call. Please try again.')
        }
    }

    const handleLeave = () => {
        navigate('/my-appointments')
    }

    if (loading) {
        return (
            <div className='flex flex-col items-center justify-center min-h-[60vh]'>
                <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                <p className='mt-4 text-gray-600 dark:text-gray-300'>Loading video consultation...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex flex-col items-center justify-center min-h-[60vh] px-4'>
                <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md text-center'>
                    <div className='text-red-500 text-5xl mb-4'>⚠️</div>
                    <h2 className='text-xl font-semibold text-red-700 dark:text-red-400 mb-2'>Unable to Join Call</h2>
                    <p className='text-gray-600 dark:text-gray-300 mb-6'>{error}</p>
                    <button
                        onClick={handleLeave}
                        className='bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors'
                    >
                        Go Back to My Appointments
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='h-screen flex flex-col -mx-2 sm:-mx-[3%] mt-[-20px]'>
            {/* Header */}
            <div className='bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                    <div>
                        <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
                            Video Consultation
                        </h2>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            with {appointment?.docData?.name}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLeave}
                    className='text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
                >
                    Leave Call
                </button>
            </div>

            {/* Jitsi Container */}
            <div ref={jitsiRef} className='flex-1 bg-gray-900'></div>

            {/* Meeting Info Footer */}
            <div className='bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 px-4 py-2 text-center'>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Meeting ID: <span className='font-mono text-gray-700 dark:text-gray-300'>{appointment?.meetingId}</span>
                </p>
            </div>
        </div>
    )
}

export default VideoConsultation
