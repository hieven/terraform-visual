const Amplitude: amplitude.AmplitudeClient = process.browser
  ? require('amplitude-js')
  : null

if (Amplitude && process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
  Amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY)
}

export { Amplitude }
