import * as G6 from '@antv/g6'
import * as entitiesPlanDetails from '@app/containers/plan-details/entities'
import * as entitiyUtilsPlanDetails from '@app/containers/plan-details/entity-utils'
import { entities } from '@app/data/entities'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

// TODO: refactor import * as entitiesPlanDetails from '@app/containers/home/entities'

interface Props {
  resources: entities.TerraformPlanResourceChange[]

  setFocusedResource: Function
}

export default (props: Props) => {
  const { resources, setFocusedResource } = props

  const ref = React.useRef(null)
  let graph: G6.TreeGraph

  useEffect(() => {
    if (resources.length === 0) {
      return
    }

    if (graph) {
      graph.destroy()
    }

    const graphData = entitiyUtilsPlanDetails.GraphData.fromTerraformPlanResourceChange(
      resources
    )

    graph = new G6.TreeGraph({
      // @ts-ignore
      container: ReactDOM.findDOMNode(ref.current),
      // @ts-ignore
      width: ref.current.offsetWidth,
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
        getId: (graphData: entitiesPlanDetails.GraphData) => graphData.id,
        getWidth: () => entitiyUtilsPlanDetails.LABEL_CONTAINER_WIDTH, // TODO:
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
  }, [resources])

  return <div ref={ref} />
}
