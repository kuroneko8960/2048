import Scene from '../core/Scene'
import Board from '../components/Board'
import Direction from '../enums/Direction'
import LoseScreen from '../components/LoseScreen'
import WinScreen from '../components/WinScreen'
import BoardStatus from '../enums/BoardStatus'

export default class MainScene extends Scene {
  private _board!: Board
  private _loseScreen!: LoseScreen
  private _winScreen!: WinScreen

  start() {
    const board = new Board()
    this.addChild(board)
    this._board = board

    const loseScreen = new LoseScreen()
    loseScreen.hide()
    this.addChild(loseScreen)
    this._loseScreen = loseScreen

    const winScreen = new WinScreen()
    winScreen.hide()
    this.addChild(winScreen)
    this._winScreen = winScreen

    this.setup()
  }

  setup() {
    this._loseScreen.hide()
    this._winScreen.hide()
    this._board.setup()
  }

  update(delta: number) {
    this._board.update(delta)
    this._loseScreen.update(delta)
    this._winScreen.update(delta)
  }

  onKeyDown(keyCode: number) {
    switch(this._board.status) {
      case BoardStatus.IN_GAME:
        switch(keyCode) {
          case 37:
            // left
            this._board.process(Direction.LEFT)
            break
          case 38:
            // up
            this._board.process(Direction.UP)
            break
          case 39:
            // right
            this._board.process(Direction.RIGHT)
            break
          case 40:
            // down
            this._board.process(Direction.DOWN)
            break
          default:
            break
        }

        // @ts-ignore
        if (this._board.status === BoardStatus.LOSE) {
          this._loseScreen.show()
        }

        // @ts-ignore
        if (this._board.status === BoardStatus.WIN) {
          this._winScreen.show()
        }

        break
      case BoardStatus.LOSE:
      case BoardStatus.WIN:
        if (keyCode === 32) {
          this.setup()
        }
        break
    }
  }
}