export interface Server {
  start(callback: () => void): void
  shutdown(): void
}
