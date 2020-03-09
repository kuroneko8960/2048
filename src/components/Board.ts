import * as PIXI from 'pixi.js'
import Tile from './Tile'
import BoardStatus from '../enums/BoardStatus'
import Direction from '../enums/Direction'

interface TilePosition {
  x: number
  y: number
}

export default class Board extends PIXI.Container {
  static COLS = 4
  static ROWS = 4
  static WIDTH = 64 * Board.COLS + (8 * (Board.COLS + 1))
  static HEIGHT = 64 * Board.ROWS + (8 * (Board.ROWS + 1))

  private _tiles: Tile[]
  private _shape!: PIXI.Graphics
  private _status!: BoardStatus

  get status() {
    return this._status
  }

  constructor() {
    super()
    this._tiles = []
    this._status = BoardStatus.NONE

    this.createSprites()
  }

  update(delta: number) {
    this._tiles.forEach((tile) => {
      tile.x = tile.tileX * (64 + 8) + 8 + 32
      tile.y = tile.tileY * (64 + 8) + 8 + 32
      tile.update(delta)
    })
  }

  createSprites() {
    const shape = new PIXI.Graphics()
    shape.beginFill(0xF5F5F5)
    shape.drawRoundedRect(0, 0, 64 * 4 + 8 * 5, 64 * 4 + 8 * 5, 16)
    shape.endFill()
    this.addChild(shape)
    this._shape = shape
  }

  removeTiles() {
    this._shape.removeChildren()
    this._tiles.splice(0, this._tiles.length)
  }

  getTileAt(x: number, y: number) {
    return this._tiles.find(tile => !tile.disable && tile.tileX === x && tile.tileY === y)
  }

  getEmptyPositions() {
    const list: TilePosition[] = []

    for (let y = 0; y < Board.ROWS; y++) {
      for (let x = 0; x < Board.COLS; x++) {
        const tile = this.getTileAt(x, y)
        if (!tile) {
          list.push({x, y})
        }
      }
    }

    return list
  }

  spawnTile(num = 1) {
    let spawned = false

    for (let i = 0; i < num; i++) {
      const emptyPositions = this.getEmptyPositions()
      if (emptyPositions.length > 0) {
        const position = emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
        this.addTile(position.x, position.y, Math.floor(Math.random() * 3 + 1))
        spawned = true
      }
    }

    return spawned
  }

  addTile(x: number, y: number, tier: number) {
    const tile = new Tile(x, y, tier)
    this._shape.addChild(tile)
    this._tiles.push(tile)
  }

  removeTile(tile: Tile) {
    this._tiles.splice(this._tiles.indexOf(tile), 1)
    this._shape.removeChild(tile)
  }

  setup() {
    this.removeTiles()
    this._status = BoardStatus.IN_GAME

    this.spawnTile(3)
  }

  process(slide: Direction) {
    if (this.status !== BoardStatus.IN_GAME) { return }

    switch (slide) {
      case Direction.LEFT:
        this.slideLeft()
        break
      case Direction.UP:
        this.slideUp()
        break
      case Direction.RIGHT:
        this.slideRight()
        break
      case Direction.DOWN:
        this.slideDown()
        break
    }

    if (this._tiles.find(tile => tile.tier >= 11)) {
      this._status = BoardStatus.WIN
      return
    }

    if (!this.spawnTile()) {
      this._status = BoardStatus.LOSE
    }
  }

  slideLeft() {
    this._tiles.sort((a, b) => a.tileX - b.tileX)
    this._tiles.forEach((tile) => {
      while(tile.tileX > 0) {
        const other = this.getTileAt(tile.tileX - 1, tile.tileY)
        if (other) {
          if (other.tier === tile.tier) {
            this.merge(other, tile)
          }
          return
        }

        tile.moveTo(tile.tileX - 1, tile.tileY)
      }
    })

    this.cleanUp()
  }

  slideRight() {
    this._tiles.sort((a, b) => b.tileX - a.tileX)
    this._tiles.forEach((tile) => {
      while(tile.tileX < Board.COLS - 1) {
        const other = this.getTileAt(tile.tileX + 1, tile.tileY)
        if (other) {
          if (other.tier === tile.tier) {
            this.merge(other, tile)
          }
          return
        }

        tile.moveTo(tile.tileX + 1, tile.tileY)
      }
    })

    this.cleanUp()
  }

  slideUp() {
    this._tiles.sort((a, b) => a.tileY - b.tileY)
    this._tiles.forEach((tile) => {
      while(tile.tileY > 0) {
        const other = this.getTileAt(tile.tileX, tile.tileY - 1)
        if (other) {
          if (other.tier === tile.tier) {
            this.merge(other, tile)
          }
          return
        }

        tile.moveTo(tile.tileX, tile.tileY - 1)
      }
    })

    this.cleanUp()
  }

  slideDown() {
    this._tiles.sort((a, b) => b.tileY - a.tileY)
    this._tiles.forEach((tile) => {
      while(tile.tileY < Board.ROWS - 1) {
        const other = this.getTileAt(tile.tileX, tile.tileY + 1)
        if (other) {
          if (other.tier === tile.tier) {
            this.merge(other, tile)
          }
          return
        }

        tile.moveTo(tile.tileX, tile.tileY + 1)
      }
    })
  
    this.cleanUp()
  }

  cleanUp() {
    this._tiles.filter(tile => tile.disable).forEach(tile => this.removeTile(tile))
  }

  merge(target: Tile, src: Tile) {
    target.promote()
    src.disable = true
  }
}