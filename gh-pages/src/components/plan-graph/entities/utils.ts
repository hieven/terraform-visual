import { PlanGraph } from '@app/components'
import { Entities } from '@app/data'

const COLOR_DARK_GREY = '#6c757d'
const COLOR_GREEN = '#28a745'
const COLOR_RED = '#dc3545'
const COLOR_YELLOW = '#ffc107'
const COLOR_WHITE = '#ffffff'

const LABEL_FONT_SIZE = 14
const LABEL_PADDING = 20
const NODE_GUTTER = 15

const getLabelWidth = (label: string): number => {
  if (typeof document !== 'undefined') {
    const context = document.createElement('canvas').getContext('2d')

    if (context) {
      context.font = `${LABEL_FONT_SIZE}px sans-serif`
      return context.measureText(label).width
    }
  }

  return label.length * LABEL_FONT_SIZE * 0.6
}

export const GraphData = {
  fromTerraformPlanResourceChange(
    changes: Entities.TerraformPlanResourceChange[],
  ): PlanGraph.Entities.GraphData {
    const intermediateGraph = IntermediateGraph.fromTerraformPlanResourceChange(changes)
    const graphChildren = IntermediateGraph.toGraphData(intermediateGraph, 0, [])

    return graphChildren
  },
}

export const IntermediateGraph = {
  fromTerraformPlanResourceChange(
    changes: Entities.TerraformPlanResourceChange[],
  ): PlanGraph.Entities.IntermediateGraph {
    const graph: PlanGraph.Entities.IntermediateGraph = {
      id: 'root',
      label: 'root',
      children: {},
    }

    for (const resource of changes) {
      if (
        Entities.Utils.TerraformPlanResourceChangeChange.getActionAlias(resource.change) ===
        Entities.TerraformPlanResourceChangeChangeActionAlias.Noop
      ) {
        continue
      }

      const addrComps = resource.address.split('.')

      let cur = graph
      for (let i = 0; i < addrComps.length; i++) {
        const addr = addrComps[i]

        if (!cur.children[addr]) {
          const id = cur.id + '.' + addr

          cur.children[addr] = {
            id,
            label: addr,
            children: {},
          }
        }

        cur = cur.children[addr]
      }

      cur.resource = resource
    }

    return graph
  },

  toGraphData(
    intermediateGraph: PlanGraph.Entities.IntermediateGraph,
    level: number,
    levelLastNode: PlanGraph.Entities.GraphData[],
  ): PlanGraph.Entities.GraphData {
    const labelWidth = getLabelWidth(intermediateGraph.label)
    const width = labelWidth + LABEL_PADDING
    const height = LABEL_FONT_SIZE + LABEL_PADDING

    const graphData: PlanGraph.Entities.GraphData = {
      id: intermediateGraph.id,
      label: intermediateGraph.label,
      children: [],
      data: {
        width,
        height,
        hGap: 0,
      },
      style: {
        size: [width, height],
        fill: COLOR_DARK_GREY,
        stroke: COLOR_DARK_GREY,
        radius: 4,
        labelText: intermediateGraph.label,
        labelFill: COLOR_WHITE,
        labelFontSize: LABEL_FONT_SIZE,
        labelPlacement: 'center',
        labelTextAlign: 'center',
        labelTextBaseline: 'middle',
      },
      resource: intermediateGraph.resource,
      hGap: 0,
    }

    if (!graphData.style) {
      return graphData
    }

    if (graphData.resource) {
      const actionAlias = Entities.Utils.TerraformPlanResourceChangeChange.getActionAlias(
        graphData.resource.change,
      )

      switch (actionAlias) {
        case Entities.TerraformPlanResourceChangeChangeActionAlias.CreateDelete: {
          graphData.style.fill = COLOR_YELLOW
          graphData.style.stroke = COLOR_YELLOW
          break
        }

        case Entities.TerraformPlanResourceChangeChangeActionAlias.Create: {
          graphData.style.fill = COLOR_GREEN
          graphData.style.stroke = COLOR_GREEN
          break
        }

        case Entities.TerraformPlanResourceChangeChangeActionAlias.Update: {
          graphData.style.fill = COLOR_YELLOW
          graphData.style.stroke = COLOR_YELLOW
          break
        }

        case Entities.TerraformPlanResourceChangeChangeActionAlias.DeleteCreate: {
          graphData.style.fill = COLOR_YELLOW
          graphData.style.stroke = COLOR_YELLOW
          break
        }

        case Entities.TerraformPlanResourceChangeChangeActionAlias.Delete: {
          graphData.style.fill = COLOR_RED
          graphData.style.stroke = COLOR_RED
          break
        }
      }
    }

    for (const child of Object.values(intermediateGraph.children)) {
      const childData = IntermediateGraph.toGraphData(child, level + 1, levelLastNode)

      graphData.children.push(childData)
    }

    const previousNode = levelLastNode[level]
    if (previousNode && previousNode.data && graphData.data) {
      previousNode.hGap = (previousNode.data.width + graphData.data.width) / 4 + NODE_GUTTER
      previousNode.data.hGap = previousNode.hGap
    }

    levelLastNode[level] = graphData

    return graphData
  },
}
