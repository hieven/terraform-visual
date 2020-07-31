import '@app/pages/_app.css'

import { Navbar } from '@app/components'
import Head from 'next/head'

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Terraform Visual</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script src="./plan.js" />
      </Head>

      <Navbar.C />

      <Component {...pageProps} />
    </>
  )
}

export default App
