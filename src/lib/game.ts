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

  constructor() {
    this.board = new Board()
    this.player1 = new Player(Cell.PLAYER_1, 'red', false)
    this.player2 = new Player(Cell.PLAYER_2, 'yellow', true)
    this.turn = writable(this.player1)
    this.status = writable({ type: 'menu' })
    this.guessing = writable(false)
  }

  new() {
    clearTimeout(turnTimeout)
    this.board.reset()
    this.turn.set(this.player1)
    this.status.set({ type: 'playing' })
    this.checkAiTurn()
  }

  setGuessing(guessing: boolean) {
    this.guessing.set(guessing)
  }

  showMenu() {
    clearTimeout(turnTimeout)
    this.status.set({ type: 'menu' })
  }

  checkAiTurn() {
    const player = get(this.turn)
    if (player.ai) {
      const depth = player.difficulty === 'easy' ? 1 : player.difficulty === 'medium' ? 3 : 5
      clearTimeout(turnTimeout)
      turnTimeout = setTimeout(() => {
        const column = getBestMove(this.board, depth, player.piece)
        this.takeTurn(column)
      }, 500)
    }
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
        this.checkAiTurn()
      }
    }
  }
}

export const game = new Game()
