const ReactGa: typeof import('react-ga4').default =
  typeof window !== 'undefined' ? require('react-ga4').default : null

if (ReactGa && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
  ReactGa.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID)
}

export { ReactGa }
