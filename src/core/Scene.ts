import * as PIXI from 'pixi.js'

export default abstract class Scene extends PIXI.Container {
  constructor() {
    super()

    this.on('added', () => { this.start() })
  }

  abstract start(): void

  abstract update(delta: number): void

  abstract onKeyDown(keyCode: number): void
}