import { FileUpload } from '@app/components'
import styles from '@app/containers/_app/navbar.module.css'
import { Amplitude } from '@app/utils/amplitude'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'

export const C = () => {
  return (
    <div className={styles.container}>
      <Link href="/">
        <h1 className={styles.brand}>Terraform Visual</h1>
      </Link>

      <Link href="/">
        <div className={styles.nav}>Home</div>
      </Link>

      <Link href="/examples/aws-s3">
        <div className={styles.nav}>Example - AWS</div>
      </Link>

      <div className={styles.nav}>
        <a
          className={styles.githubLink}
          href="https://github.com/hieven/terraform-visual"
          target="_blank"
        >
          <FaGithub className={styles.githubIcon} size="2.5rem" />
          <p className={styles.github}>GitHub</p>
        </a>
      </div>

      <div className={styles.fileUploadContainer}>
        <FileUpload.C afterUploaded={afterFileUploaded} />
      </div>
    </div>
  )
}
const afterFileUploaded = () => {
  Amplitude.logEvent('upload file', { component: 'navbar' })
}
