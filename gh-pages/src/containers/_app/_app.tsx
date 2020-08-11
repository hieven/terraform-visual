import { Navbar } from '@app/containers/_app'
import styles from '@app/containers/_app/app.module.css'
import { TerraofmrPlanProvider } from '@app/context/terraform-plan'
import { ReactGa } from '@app/utils/google-analytics'
import Head from 'next/head'
import { Router } from 'next/router'
import { useEffect } from 'react'

export const C = ({ Component, pageProps }: any) => {
  const title = 'Terraform Visual'

  useEffect(() => {
    ReactGa.set({ page: window.location.pathname })
    ReactGa.pageview(window.location.pathname)

    Router.events.on('routeChangeComplete', () => {
      ReactGa.set({ page: window.location.pathname })
      ReactGa.pageview(window.location.pathname)
    })
  }, [])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="title" />
      </Head>

      <TerraofmrPlanProvider>
        <Navbar.C />

        <div className={styles.container}>
          <Component {...pageProps} />
        </div>
      </TerraofmrPlanProvider>
    </>
  )
}
