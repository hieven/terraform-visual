import type { AmplitudeClient } from 'amplitude-js'

const amplitudeModule = typeof window !== 'undefined' ? require('amplitude-js') : null
const Amplitude: AmplitudeClient | null = amplitudeModule?.default ?? amplitudeModule

if (Amplitude && process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
  Amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY)
}

export { Amplitude }
