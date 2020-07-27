import styles from '@app/containers/_app/index.module.css'
import Navbar from '@app/containers/_app/navbar'
import { ReduxWrapper } from '@app/data/redux/store'
import { AppProps } from 'next/app'
import Head from 'next/head'

export default ReduxWrapper.withRedux((props: AppProps) => {
  const { Component, pageProps } = props
  const title = 'Terraform Visual'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="title" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Navbar />

      <div className={styles.container}>
        <Component {...pageProps} />
      </div>
    </>
  )
})
