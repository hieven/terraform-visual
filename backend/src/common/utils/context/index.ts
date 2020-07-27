export class Context {
  private dict: { [key: string]: unknown }

  constructor() {
    this.dict = {}
  }

  set(key: string, value: unknown): void {
    this.dict[key] = value
  }

  get(key: string): unknown {
    return this.dict[key]
  }
}
