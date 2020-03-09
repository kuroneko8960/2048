import * as PIXI from 'pixi.js'

enum TileAnimation {
  NONE,
  SPAWN,
  PROMOTE,
}

class TileColor {
  private _background: number
  private _foreground: number

  constructor(background: number, foreground: number) {
    this._background = background
    this._foreground = foreground
  }

  get background() {
    return this._background
  }

  get foreground() {
    return this._foreground
  }
}

export default class Tile extends PIXI.Container {
  private static COLORS = [
    new TileColor(0x2962FF, 0xFFFFFF),
    new TileColor(0x0091EA, 0xFFFFFF),
    new TileColor(0x00B8D4, 0xFFFFFF),
    new TileColor(0x00BFA5, 0xFFFFFF),
    new TileColor(0x00C853, 0xFFFFFF),
    new TileColor(0x64DD17, 0xFFFFFF),
    new TileColor(0xAEEA00, 0x000000),
    new TileColor(0xFFD600, 0x000000),
    new TileColor(0xFFAB00, 0xFFFFFF),
    new TileColor(0xFF6D00, 0xFFFFFF),
    new TileColor(0xDD2C00, 0xFFFFFF),
  ]

  static WIDTH = 64
  static HEIGHT = 64
  static NUMBER_SIZE = 24

  private _tileX: number
  private _tileY: number
  private _tier: number
  private _shape!: PIXI.Graphics
  private _numberText!: PIXI.Text
  disable = false

  private _animation = TileAnimation.NONE
  private _animationValue = 0

  get tileX() {
    return this._tileX
  }

  get tileY() {
    return this._tileY
  }

  get tier() {
    return this._tier
  }

  constructor(x: number,y: number, tier: number) {
    super()
    this._tileX = x
    this._tileY = y
    this._tier = tier
    this.startAnimation(TileAnimation.SPAWN)

    this.createSprites()
    this.updateSprites()
    this.update(0)
  }

  createSprites() {
    const shape = new PIXI.Graphics()
    shape.beginFill(0xFFFFFF)
    shape.drawRoundedRect(0, 0, Tile.WIDTH, Tile.HEIGHT, Tile.WIDTH / 4)
    shape.endFill()
    this.addChild(shape)
    this._shape = shape

    const text = new PIXI.Text('0', {
      fontFamily: 'Bellota',
      fontSize: Tile.NUMBER_SIZE,
    })
    text.anchor.set(0.5, 0.5)
    text.x = Tile.WIDTH / 2
    text.y = Tile.HEIGHT / 2
    shape.addChild(text)
    this._numberText = text

    this.pivot.set(Tile.WIDTH / 2, Tile.HEIGHT / 2)
  }

  updateSprites() {
    this._shape.tint = Tile.COLORS[this.tier].background
    this._numberText.text = '' + 2 ** this.tier
    this._numberText.style.color = Tile.COLORS[this.tier].foreground
  }

  moveTo(x: number, y: number) {
    this._tileX = x
    this._tileY = y
  }

  promote() {
    this._tier += 1
    this.updateSprites()
    this.startAnimation(TileAnimation.PROMOTE)
  }

  startAnimation(animation: TileAnimation) {
    this._animation = animation
    this._animationValue = 0
  }

  update(delta: number) {
    switch(this._animation) {
      case TileAnimation.NONE:
        this.scale.set(1)
        break
      case TileAnimation.SPAWN:
        this._animationValue += delta / 15
        this.scale.set(this._animationValue)
        break
      case TileAnimation.PROMOTE:
        this._animationValue += delta / 15
        this.scale.set((1 - this._animationValue) * 0.5 + 1)
        break
    }

    if (this._animationValue >= 1) {
      this.startAnimation(TileAnimation.NONE)
    }
  }
}