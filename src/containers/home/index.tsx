import FileUpload from '@app/containers/_common/file-upload'
import styles from '@app/containers/home/index.module.css'
import { Container, Jumbotron } from 'react-bootstrap'
import { Amplitude } from '@app/utils/amplitude'
import { useEffect } from 'react'

export default () => {
  useEffect(() => {
    Amplitude.logEvent('enter page', { page: 'home' })
  }, [])

  return (
    <>
      <Container className={styles.container}>
        <Jumbotron>
          <h1>Welcome to Terraform Visual</h1>
          <p>
            A simple visualization tool to help you understand your Terraform
            plan easily
          </p>

          <div className={styles.stepContainer}>
            <h6>
              First, generate Terraform plan in JSON format via following code
            </h6>

            <div className={styles.codeContainer}>
              <pre>$ terraform plan -out=plan.out</pre>
              <pre>$ terraform show -json plan.out {`>`} plan.json</pre>
            </div>
          </div>

          <div className={styles.stepContainer}>
            <h6>Second, upload you Terraform JSON file to the platform</h6>

            <FileUpload afterUploaded={afterFileUploaded} />
          </div>
        </Jumbotron>
      </Container>
    </>
  )
}

const afterFileUploaded = () => {
  Amplitude.logEvent('upload file', { page: 'home', component: 'steps' })
}
