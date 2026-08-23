import { FocusedView, PlanGraph } from '@app/components'
import { Entities } from '@app/data'
import styles from '@app/pages/index.module.css'
import { useEffect, useState } from 'react'

const Home = () => {
  const [plan, setPlan] = useState<Entities.TerraformPlan>()

  useEffect(() => {
    //@ts-ignore
    setPlan(window.TF_PLAN)
  }, [])

  const [focusedResource, setFocusedResource] = useState<Entities.TerraformPlanResourceChange>()

  return (
    <div className={styles.container}>
      <PlanGraph.C plan={plan} setFocusedResource={setFocusedResource} />
      <FocusedView.C resource={focusedResource} />
    </div>
  )
}

export default Home
