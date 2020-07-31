import styles from '@app/components/navbar/navbar.module.css'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'

export const C = () => {
  return (
    <div className={styles.container}>
      <Link href="/">
        <h1 className={styles.brand}>Terraform Visual</h1>
      </Link>

      <div className={styles.githubContainer}>
        <a
          className={styles.githubLink}
          href="https://github.com/hieven/terraform-visual"
          target="_blank"
        >
          <FaGithub className={styles.githubIcon} size="2.5rem" />
          <p className={styles.github}>GitHub</p>
        </a>
      </div>
    </div>
  )
}
