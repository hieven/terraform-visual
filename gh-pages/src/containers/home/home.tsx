import { FileUpload } from '@app/components'
import styles from '@app/containers/home/home.module.css'
import { Amplitude } from '@app/utils/amplitude'
import { useEffect } from 'react'

export const C = () => {
  useEffect(() => {
    Amplitude.logEvent('enter page', { page: 'home' })
  }, [])

  return (
    <>
      <div className={styles.container}>
        <div className={styles.jumbotron}>
          <h1>Welcome to Terraform Visual</h1>
          <p>A simple visualization tool to help you understand your Terraform plan easily</p>

          <div className={styles.stepContainer}>
            <h4>First, generate Terraform plan in JSON format via following code</h4>

            <div className={styles.codeContainer}>
              <pre>$ terraform plan -out=plan.out</pre>
              <pre>$ terraform show -json plan.out {`>`} plan.json</pre>
            </div>
          </div>

          <div className={styles.stepContainer}>
            <h4>Second, upload you Terraform JSON file to the platform</h4>

            <FileUpload.C afterUploaded={afterFileUploaded} />
          </div>
        </div>
      </div>
    </>
  )
}

const afterFileUploaded = () => {
  Amplitude.logEvent('upload file', { page: 'home', component: 'steps' })
}
