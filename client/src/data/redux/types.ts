export interface ReduxState<Entity> {
  data: {
    [id: string]: Entity | undefined
  }
  filter: {
    [key: string]: string[] | undefined
  }
}
