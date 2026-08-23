import type { BaseNodeStyleProps } from '@antv/g6'
import { Entities } from '@app/data'

type GraphNodeStyle = BaseNodeStyleProps & {
  radius?: number
}

export interface GraphData {
  id: string
  label: string
  style?: GraphNodeStyle
  data?: {
    width: number
    height: number
    hGap: number
  }
  children: GraphData[]
  resource?: Entities.TerraformPlanResourceChange
  hGap: number
}

export interface IntermediateGraph {
  id: string
  label: string
  resource?: Entities.TerraformPlanResourceChange
  children: {
    [key: string]: IntermediateGraph
  }
}
