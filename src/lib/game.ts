import { get, writable } from 'svelte/store'
import { Cell, board } from './board'

type Player = Cell.RED | Cell.YELLOW

const turnStore = writable<Player>()
const winStore = writable<
  | false
  | {
      winner: Cell
      cells: number[][]
    }
>(false)

function switchTurn() {
  turnStore.update((cur) => (cur === Cell.RED ? Cell.YELLOW : Cell.RED))
}

// try to place a marker for the current player at given position
// switch turns if marker is placed usccessfully
function takeTurn(col: number) {
  if (board.checkForWin() || !board.placeMarker(col, get(turnStore))) return
  const win = board.checkForWin()
  if (win) {
    winStore.set(win)
  } else {
    switchTurn()
  }
}

// create a new game board and randomly choose a starting player
function newGame() {
  board.createNewBoard()
  turnStore.set(Math.random() > 0.5 ? Cell.RED : Cell.YELLOW)
  winStore.set(false)
}

export const game = {
  turn: {
    subscribe: turnStore.subscribe
  },
  winner: {
    subscribe: winStore.subscribe
  },
  switchTurn,
  newGame,
  takeTurn
}
