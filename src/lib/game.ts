import { get, writable, type Writable } from 'svelte/store'
import { Board, Cell } from './board'
import { Player } from './player'
import { getBestMove } from './ai'

class Game {
  public board: Board
  public turn: Writable<Player>
  public player1: Player
  public player2: Player
  public status: Writable<
    { type: 'playing' | 'tie' } | { type: 'win'; player: Player; cells: number[][] }
  >

  constructor() {
    this.board = new Board()
    this.player1 = new Player(Cell.PLAYER_1, 'red')
    this.player2 = new Player(Cell.PLAYER_2, 'yellow', true)
    this.turn = writable(this.player1)
    this.status = writable({ type: 'playing' })

    this.checkAiTurn()
  }

  new() {
    this.board.reset()
    this.turn.set(this.player1)
    this.status.set({ type: 'playing' })
    this.checkAiTurn()
  }

  checkAiTurn() {
    const player = get(this.turn)
    if (player.ai) {
      setTimeout(() => {
        const column = getBestMove(this.board, 3, player.piece)
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
