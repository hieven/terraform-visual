const ReactGa: typeof import('react-ga') = process.browser ? require('react-ga') : null

if (ReactGa && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
  ReactGa.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID)
}

export { ReactGa }
