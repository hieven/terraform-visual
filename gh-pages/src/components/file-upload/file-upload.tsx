import { useDispatchTerraformPlan } from '@app/context/terraform-plan'
import { Entities } from '@app/data'
import { useRouter } from 'next/router'
import styles from '@app/components/file-upload/file-upload.module.css'

interface Props {
  afterUploaded?: Function
}

export const C = (props: Props) => {
  const router = useRouter()
  const dispatch = useDispatchTerraformPlan()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return
    }

    const fileReader = new FileReader()

    fileReader.onload = () => {
      if (typeof fileReader.result !== 'string') {
        return
      }

      if (props.afterUploaded) {
        props.afterUploaded()
      }

      const terraformPlan = Entities.Utils.TerraformPlan.fromJsonStr(fileReader.result)

      dispatch({
        type: 'UPLOAD_TERRAFORM_PLAN',
        payload: terraformPlan,
      })

      router.push({ pathname: '/plan-details' }, '/terraform-visual/plan-details')
    }

    fileReader.readAsText(event.target.files[0])
  }

  return (
    <div className={styles.inputFileContainer}>
      <input className={styles.inputFile} type="file" onChange={handleFileUpload} />
      <div className={styles.inputBar}>Upload Terraform JSON file</div>
      <button className={styles.btn}>Submit</button>
    </div>
  )
}
