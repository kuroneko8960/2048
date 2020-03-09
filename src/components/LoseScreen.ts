import * as PIXI from 'pixi.js'
import Board from './Board'

export enum LoseScreenAnimation {
  NONE,
  APPEAR,
}

export default class LoseScreen extends PIXI.Container {
  private _animation = LoseScreenAnimation.NONE
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

    const gameover = new PIXI.Text('Game Over', {
      fontFamily: 'Bellota',
      fontSize: 48,
      fill: 0xFFFFFF
    })
    gameover.anchor.set(0.5, 0.5)
    gameover.x = Board.WIDTH / 2
    gameover.y = Board.HEIGHT / 3
    screen.addChild(gameover)

    const hitspace = new PIXI.Text('Space to Retry', {
      fontFamily: 'Bellota',
      fontSize: 24,
      fill: 0xFFFFFF
    })
    hitspace.anchor.set(0.5, 0.5)
    hitspace.x = Board.WIDTH / 2
    hitspace.y = Board.HEIGHT * 3 / 4
    screen.addChild(hitspace)
  }

  startAnimation(animation: LoseScreenAnimation) {
    this._animation = animation
    this._animationValue = 0
  }

  update(delta: number) {
    switch(this._animation) {
      case LoseScreenAnimation.NONE:
        this.alpha = 1
        break
      case LoseScreenAnimation.APPEAR:
        this._animationValue += delta / 15
        this.alpha = this._animationValue
        break
    }

    if (this._animationValue >= 1) {
      this.startAnimation(LoseScreenAnimation.NONE)
    }
  }

  show() {
    this.visible = true
    this.startAnimation(LoseScreenAnimation.APPEAR)
  }

  hide() {
    this.visible = false
  }
}