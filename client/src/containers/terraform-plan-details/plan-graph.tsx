import * as G6 from '@antv/g6'
import styles from '@app/containers/terraform-plan-details/plan-graph.module.css'
import * as entitiesTerraformPlanDetails from '@app/containers/terraform-plan-details/entities'
import * as entitiyUtilsTerraformPlanDetails from '@app/containers/terraform-plan-details/entity-utils'
import { Entities } from '@app/data'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

interface Props {
  plan?: Entities.TerraformPlan

  setFocusedResource: Function
}

export default (props: Props) => {
  const { plan, setFocusedResource } = props

  const ref = React.useRef<HTMLDivElement>(null)
  let graph: G6.TreeGraph

  useEffect(() => {
    if (!plan) {
      return
    }

    if (graph) {
      graph.destroy()
    }

    const graphData = entitiyUtilsTerraformPlanDetails.GraphData.fromTerraformPlanResourceChange(
      plan.resource_changes,
    )

    graph = new G6.TreeGraph({
      // @ts-ignore
      container: ReactDOM.findDOMNode(ref.current),
      width: ref?.current?.clientWidth || 0,
      height: 550, // TODO: customize
      linkCenter: true,
      modes: {
        default: [
          {
            type: 'collapse-expand',
            onChange(item, collapsed) {
              if (!item) {
                return
              }

              item.get('model').data.collapsed = collapsed
              return true
            },
          },
          'drag-canvas',
          {
            type: 'zoom-canvas',
            // @ts-ignore
            sensitivity: 1,
            minZoom: 0.5,
          },
        ],
      },
      layout: {
        type: 'compactBox',
        direction: 'TB',
        getId: (graphData: entitiesTerraformPlanDetails.GraphData) => graphData.id,
        getWidth: () => entitiyUtilsTerraformPlanDetails.LABEL_CONTAINER_WIDTH, // TODO:
      },
      defaultNode: {
        type: 'rect',

        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
      },
      defaultEdge: {
        type: 'cubic-vertical',
      },
    })

    graph.on('node:mouseenter', (event: any) => {
      if (!event.item._cfg.model.resource) {
        return
      }

      setFocusedResource(event.item._cfg.model.resource)
    })

    graph.data(graphData)
    graph.render()
    graph.fitView()

    return () => {
      if (!graph) {
        return
      }

      graph.destroy()
    }
  }, [plan])

  if (!plan) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>loading graph...</p>
      </div>
    )
  }

  return <div className={styles.container} ref={ref} />
}
