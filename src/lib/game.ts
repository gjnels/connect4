import { get, writable, type Writable } from 'svelte/store'
import { Board, Cell } from './board'
import { Player } from './player'
import { getBestMove } from './ai'

let turnTimeout: number

class Game {
  public board: Board
  public turn: Writable<Player>
  public player1: Player
  public player2: Player
  public status: Writable<
    { type: 'menu' | 'playing' | 'tie' } | { type: 'win'; player: Player; cells: number[][] }
  >
  public guessing: Writable<boolean>
  public guessScore: Writable<number>

  constructor() {
    this.board = new Board()
    this.player1 = new Player(Cell.PLAYER_1, 'red', false)
    this.player2 = new Player(Cell.PLAYER_2, 'yellow', true)
    this.turn = writable(this.player1)
    this.status = writable({ type: 'menu' })
    this.guessing = writable(false)
    this.guessScore = writable(0)
  }

  new() {
    clearTimeout(turnTimeout)
    this.board.reset()
    this.turn.set(this.player1)
    this.guessScore.set(0)
    this.status.set({ type: 'playing' })
    if (!get(this.guessing) && this.isAiTurn()) this.takeAiTurn(this.getAiColumn())
  }

  showMenu() {
    clearTimeout(turnTimeout)
    this.status.set({ type: 'menu' })
  }

  isAiTurn() {
    return get(this.turn).ai
  }

  takeAiTurn(column: number) {
    clearTimeout(turnTimeout)
    turnTimeout = setTimeout(() => {
      this.takeTurn(column)
    }, 500)
  }

  getAiColumn() {
    const player = get(this.turn)
    const depth = player.difficulty === 'easy' ? 1 : player.difficulty === 'medium' ? 3 : 5
    return getBestMove(this.board, depth, player.piece)
  }

  makeGuess(columnGuess: number) {
    const validLocations = this.board.getValidLocations()
    if (!validLocations.includes(columnGuess)) return
    const column = this.getAiColumn()
    if (columnGuess === column) this.guessScore.update((s) => s + 100)
    this.takeAiTurn(column)
  }

  takeTurn(column: number) {
    if (this.board.placePiece(get(this.turn).piece, column)) {
      const winner = this.board.checkForWinner()
      if (winner) {
        this.status.set({
          type: 'win',
          cells: winner.cells,
          player: winner.player === Cell.PLAYER_1 ? this.player1 : this.player2
        })
      } else if (this.board.isFull()) {
        this.status.set({ type: 'tie' })
      } else {
        this.turn.update((t) => (t.piece === Cell.PLAYER_1 ? this.player2 : this.player1))
        if (!get(this.guessing) && this.isAiTurn()) {
          this.takeAiTurn(this.getAiColumn())
        }
      }
    }
  }
}

export const game = new Game()
