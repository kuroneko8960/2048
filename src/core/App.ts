import * as PIXI from 'pixi.js'
import Scene from './Scene'

export default class App {
  private _application: PIXI.Application
  private _scene!: Scene

  constructor(target: string) {
    const element = document.querySelector(target)

    if (!element) {
      throw new Error('Target element is not found.')
    }

    this._application = new PIXI.Application({
      backgroundColor: 0xFFFFFF,
      width: 64 * 4 + 8 * 5,
      height: 64 * 4 + 8 * 5,
    })

    element.appendChild(this._application.view)

    window.addEventListener('keydown', (ev) => {
      if (this._scene) {
        this._scene.onKeyDown(ev.keyCode)
      }
    })

    this._application.ticker.add((delta) => {
      if (this._scene) {
        this._scene.update(delta)
      }
    })
  }

  changeScene(scene: Scene) {
    if (this._scene) {
      this._application.stage.removeChild(this._scene)
    }

    this._scene = scene
    this._application.stage.addChild(this._scene)
  }
}