import { ILabelConfig } from '@antv/g6/lib/interface/shape'
import { ShapeStyle } from '@antv/g6/lib/types'
import { Entities } from '@app/data'

export interface GraphData {
  id: string
  label: string
  style?: ShapeStyle
  labelCfg?: ILabelConfig
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
