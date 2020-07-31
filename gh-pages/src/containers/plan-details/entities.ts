import { ILabelConfig } from '@antv/g6/lib/interface/shape'
import { ShapeStyle } from '@antv/g6/lib/types'
import { entities } from '@app/data/entities'

export interface GraphData {
  id: string
  label: string
  style?: ShapeStyle
  labelCfg?: ILabelConfig
  children: GraphData[]
  resource?: entities.TerraformPlanResourceChange
}

export interface IntermediateGraph {
  id: string
  label: string
  resource?: entities.TerraformPlanResourceChange
  children: {
    [key: string]: IntermediateGraph
  }
}
