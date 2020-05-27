import styles from '@app/containers/_app/index.module.css'
import Navbar from '@app/containers/_app/navbar'
import { TerraofmrPlanProvider } from '@app/context/terraform-plan'
import Head from 'next/head'

export default ({ Component, pageProps }: any) => {
  const title = 'Terraform Visual'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="title" />
      </Head>

      <TerraofmrPlanProvider>
        <Navbar />

        <div className={styles.container}>
          <Component {...pageProps} />
        </div>
      </TerraofmrPlanProvider>
    </>
  )
}
