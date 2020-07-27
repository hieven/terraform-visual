import styles from '@app/containers/home/index.module.css'

export default () => {
  return (
    <>
      <div className={styles.container}>
        <div>
          <h1>Welcome to Terraform Visual</h1>
          <p>A simple visualization tool to help you understand your Terraform plan easily</p>

          <div className={styles.stepContainer}>
            <h6>First, generate Terraform plan in JSON format via following code</h6>

            <div className={styles.codeContainer}>
              <pre>$ terraform plan -out=plan.out</pre>
              <pre>$ terraform show -json plan.out {`>`} plan.json</pre>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
