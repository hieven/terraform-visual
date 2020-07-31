import styles from '@app/containers/plan-details/focused-resource-view.module.css'
import { entities, entityUtils } from '@app/data/entities'
import _ from 'lodash'
import { MouseEventHandler, useState } from 'react'
import { Container } from 'react-bootstrap'
import {
  BsArrowRight,
  BsChevronDoubleDown,
  BsChevronDoubleUp,
} from 'react-icons/bs'

interface Props {
  resource: entities.TerraformPlanResourceChange | null
}

const EXPAND_STATE = [
  { className: 'h30', iconName: BsChevronDoubleUp },
  { className: 'h150', iconName: BsChevronDoubleUp },
  { className: 'h300', iconName: BsChevronDoubleDown },
]

export const FocusedResourceView = (props: Props) => {
  const { resource } = props

  const [expandState, setExpandState] = useState(1)

  const handleClickOnExpandButton = () => {
    setExpandState((expandState + 1) % EXPAND_STATE.length)
  }

  return (
    <div
      className={`${styles.container} ${
        styles[EXPAND_STATE[expandState].className]
      }`}
    >
      <ExpandButton
        expandState={expandState}
        handleClick={handleClickOnExpandButton}
      />

      {resource && <ResourceDetailsView resourceChange={resource} />}
    </div>
  )
}

interface ExpandButtonProps {
  expandState: number
  handleClick: MouseEventHandler
}

const ExpandButton = (props: ExpandButtonProps) => {
  return (
    <div className={styles.expandButton} onClick={props.handleClick}>
      {props.expandState === EXPAND_STATE.length - 1 ? (
        <BsChevronDoubleDown />
      ) : (
        <BsChevronDoubleUp />
      )}
    </div>
  )
}

interface ResourceChangeProps {
  resourceChange: entities.TerraformPlanResourceChange
}
const ResourceDetailsView = (props: ResourceChangeProps) => {
  const { resourceChange } = props

  return (
    <div className={styles.resourceContainer}>
      <Container>
        <h5>{resourceChange.address}</h5>
        {renderActions(resourceChange.change.actions)}
        {renderFieldChanges(resourceChange.change)}
      </Container>
    </div>
  )
}

const renderActions = (actions: string[]) => {
  const actionElems: JSX.Element[] = [<span>[</span>]

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i]
    const colorClassName = getActionsColorClassName(action)

    actionElems.push(<span className={colorClassName}>{action}</span>)

    if (i !== actions.length - 1) {
      actionElems.push(<span>, </span>)
    }
  }

  actionElems.push(<span>]</span>)

  return (
    <pre className={styles.fieldContainer}>
      <span className={styles.fieldName}>Actions: </span>
      <span>{actionElems}</span>
    </pre>
  )
}

const getActionsColorClassName = (action: string): string => {
  switch (action) {
    case entities.TerraformPlanResourceChangeChangeAction.Create: {
      return styles.colorGreen
    }
    case entities.TerraformPlanResourceChangeChangeAction.Update: {
      return styles.colorYellow
    }
    case entities.TerraformPlanResourceChangeChangeAction.Delete: {
      return styles.colorRed
    }
    default: {
      return ''
    }
  }
}

const renderFieldChanges = (
  change: entities.TerraformPlanResourceChangeChange
): JSX.Element[] => {
  const elems: JSX.Element[] = []

  const actionAlias = entityUtils.TerraformPlanResourceChangeChange.getActionAlias(
    change
  )
  const diff = entityUtils.TerraformPlanResourceChangeChange.getDiff(change)

  for (const field of Object.keys(diff)) {
    elems.push(renderFieldChange(field, diff[field], actionAlias))
  }

  return elems
}

const renderFieldChange = (
  field: string,
  changes: string[],
  actionAlias: entities.TerraformPlanResourceChangeChangeActionAlias
): JSX.Element => {
  const beforeChange = changes[0]
  const afterChange = changes[changes.length - 1]

  const [
    beforeChangeColorClassName,
    afterChangeColorClassName,
  ] = getFieldChangeColorClassName(actionAlias)

  return (
    <pre key={field} className={styles.fieldContainer}>
      <span className={styles.fieldName}>{field}:</span>
      <span
        className={`${styles.fieldBeforeVal} ${beforeChangeColorClassName}`}
      >
        {prettifyJson(beforeChange)}
      </span>

      {!_.isEqual(beforeChange, afterChange) && (
        <>
          <span className={styles.arrow}>
            <BsArrowRight />
          </span>
          <span
            className={`${styles.fieldAfterVal} ${afterChangeColorClassName}`}
          >
            {prettifyJson(afterChange)}
          </span>
        </>
      )}
    </pre>
  )
}

const getFieldChangeColorClassName = (
  actionAlias: entities.TerraformPlanResourceChangeChangeActionAlias
): [string, string] => {
  switch (actionAlias) {
    case entities.TerraformPlanResourceChangeChangeActionAlias.Create:
      return [styles.colorGreen, styles.colorGreen]
    case entities.TerraformPlanResourceChangeChangeActionAlias.Update:
      return [styles.colorYellow, styles.colorYellow]
    case entities.TerraformPlanResourceChangeChangeActionAlias.Delete:
      return [styles.colorRed, styles.colorRed]
    case entities.TerraformPlanResourceChangeChangeActionAlias.CreateDelete:
      return [styles.colorGreen, styles.colorRed]
    case entities.TerraformPlanResourceChangeChangeActionAlias.DeleteCreate:
      return [styles.colorRed, styles.colorGreen]
    default:
      return [styles.colorYellow, styles.colorYellow]
  }
}

const prettifyJson = (input: string): string => {
  const [parsedJson, isValidJson] = tryParseJson(input)

  if (isValidJson) {
    return JSON.stringify(parsedJson, null, 4)
  }

  return JSON.stringify(input, null, 4)
}

const tryParseJson = (input: string): [{}, boolean] => {
  try {
    const parsedJson = JSON.parse(input)
    return [parsedJson, true]
  } catch (err) {
    return [{}, false]
  }
}
