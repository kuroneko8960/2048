import * as PIXI from 'pixi.js'
import Hammer from 'hammerjs'
import Scene from './Scene'

export default class App {
  private _application: PIXI.Application
  private _scene!: Scene

  constructor(target: string) {
    const element = document.querySelector(target) as HTMLElement

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

    const hammer = new Hammer(element)
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL })
    hammer.get('press').set({ time: 100 })
    hammer.on('press', () => {
      if (this._scene) {
        this._scene.onKeyDown(32)
      }
    })
    hammer.on('swipeleft', () => {
      if (this._scene) {
        this._scene.onKeyDown(37)
      }
    })
    hammer.on('swipeup', () => {
      if (this._scene) {
        this._scene.onKeyDown(38)
      }
    })
    hammer.on('swiperight', () => {
      if (this._scene) {
        this._scene.onKeyDown(39)
      }
    })
    hammer.on('swipedown', () => {
      if (this._scene) {
        this._scene.onKeyDown(40)
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