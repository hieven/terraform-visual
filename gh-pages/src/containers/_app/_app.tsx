import { Navbar } from '@app/containers/_app'
import styles from '@app/containers/_app/app.module.css'
import { TerraofmrPlanProvider } from '@app/context/terraform-plan'
import Head from 'next/head'

export const C = ({ Component, pageProps }: any) => {
  const title = 'Terraform Visual'

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
