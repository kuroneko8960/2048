import * as PIXI from 'pixi.js'
import Board from './Board'

export enum WinScreenAnimation {
  NONE,
  APPEAR,
}

export default class WinScreen extends PIXI.Container {
  private _animation = WinScreenAnimation.NONE
  private _animationValue = 0

  constructor() {
    super()

    this.createSprites()
  }

  createSprites() {
    const screen = new PIXI.Graphics()
    screen.beginFill(0x000000, 0.7)
    screen.drawRect(0, 0, Board.WIDTH, Board.HEIGHT)
    screen.endFill()
    this.addChild(screen)

    const congraturations = new PIXI.Text('Congraturations!', {
      fontFamily: 'Bellota',
      fontSize: 32,
      fill: 0xFFFFFF
    })
    congraturations.anchor.set(0.5, 0.5)
    congraturations.x = Board.WIDTH / 2
    congraturations.y = Board.HEIGHT / 3
    screen.addChild(congraturations)

    const hitspace = new PIXI.Text('Tap to Retry', {
      fontFamily: 'Bellota',
      fontSize: 24,
      fill: 0xFFFFFF
    })
    hitspace.anchor.set(0.5, 0.5)
    hitspace.x = Board.WIDTH / 2
    hitspace.y = Board.HEIGHT * 3 / 4
    screen.addChild(hitspace)
  }

  startAnimation(animation: WinScreenAnimation) {
    this._animation = animation
    this._animationValue = 0
  }

  update(delta: number) {
    switch(this._animation) {
      case WinScreenAnimation.NONE:
        this.alpha = 1
        break
      case WinScreenAnimation.APPEAR:
        this._animationValue += delta / 15
        this.alpha = this._animationValue
        break
    }

    if (this._animationValue >= 1) {
      this.startAnimation(WinScreenAnimation.NONE)
    }
  }

  show() {
    this.visible = true
    this.startAnimation(WinScreenAnimation.APPEAR)
  }

  hide() {
    this.visible = false
  }
}