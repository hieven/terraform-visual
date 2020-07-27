import Link from 'next/link'
import styles from '@app/containers/_app/navbar.module.css'

export default () => {
  return (
    <div className={styles.container}>
      <Link href="/">
        <h1 className={styles.brand}>Terraform Visual</h1>
      </Link>
    </div>
  )
}
