import { useDispatchTerraformPlan } from '@app/context/terraform-plan'
import { entityUtils } from '@app/data/entities'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Form } from 'react-bootstrap'

interface Props {
  afterUploaded?: Function
}

export default (props: Props) => {
  const router = useRouter()
  const dispatch = useDispatchTerraformPlan()

  const [key, setKey] = useState(new Date().getTime())

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

      const terraformPlan = entityUtils.TerraformPlan.fromJsonStr(
        fileReader.result
      )

      dispatch({
        type: 'UPLOAD_TERRAFORM_PLAN',
        payload: terraformPlan,
      })

      router.push(
        { pathname: '/plan-details' },
        '/terraform-visual/plan-details'
      )
    }

    fileReader.readAsText(event.target.files[0])
    setKey(new Date().getTime())
  }

  return (
    <Form>
      <Form.File
        key={key}
        id="custom-file"
        label="Upload Terraform json file"
        data-browse="Submit"
        custom
        onChange={handleFileUpload}
      />
    </Form>
  )
}
