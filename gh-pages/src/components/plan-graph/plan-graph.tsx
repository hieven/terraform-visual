import type { Graph as G6Graph } from '@antv/g6'
const G6: typeof import('@antv/g6') | null =
  typeof window !== 'undefined' ? require('@antv/g6') : null

import { PlanGraph } from '@app/components'
import styles from '@app/components/plan-graph/plan-graph.module.css'
import { Entities } from '@app/data'
import React, { useEffect } from 'react'

interface Props {
  plan?: Entities.TerraformPlan

  setFocusedResource: Function
}

export const C = (props: Props) => {
  const { plan, setFocusedResource } = props

  const ref = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!plan || !G6) {
      return
    }

    const graphData = PlanGraph.Entities.Utils.GraphData.fromTerraformPlanResourceChange(
      plan.resource_changes,
    )

    const graph: G6Graph = new G6.Graph({
      container: ref.current ?? undefined,
      width: ref?.current?.clientWidth || 0,
      height: 550, // TODO: customize
      autoFit: 'view',
      behaviors: [
        { type: 'collapse-expand', trigger: 'click' },
        'drag-canvas',
        { type: 'zoom-canvas', sensitivity: 1 },
      ],
      layout: {
        type: 'compact-box',
        direction: 'TB',
        getId: (layoutData: any) => layoutData.id,
        getWidth: (layoutData: any) => layoutData.data?.width || 0,
        getHeight: (layoutData: any) => layoutData.data?.height || 0,
        getHGap: (layoutData: any) => layoutData.data?.hGap || 0,
      },
      node: {
        type: 'rect',
      },
      edge: {
        type: 'cubic-vertical',
        style: {
          stroke: '#e6e6e6',
          lineWidth: 3,
        },
      },
      data: G6.treeToGraphData(graphData),
    })

    graph.on('node:pointerenter', (event: any) => {
      const resource = graph.getNodeData(event.target.id)?.resource

      if (!resource) {
        return
      }

      setFocusedResource(resource)
    })

    graph.render()

    return () => {
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
