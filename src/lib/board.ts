import { get, writable } from 'svelte/store'

export enum Cell {
  EMPTY,
  RED,
  YELLOW
}

const BOARD_WIDTH = 7
const BOARD_HEIGHT = 6

const boardStore = writable<Cell[][]>([])

// create a new array of arrays filled with empty cells
// outer array holds each row, with inner arrays holding cells for each column
function createNewBoard() {
  const newBoard: Cell[][] = []
  for (let row = 0; row < BOARD_WIDTH; row++) {
    const newRow: Cell[] = []
    for (let col = 0; col < BOARD_HEIGHT; col++) {
      newRow.push(Cell.EMPTY)
    }
    newBoard.push(newRow)
  }
  boardStore.set(newBoard)
}

// determine if the given column is within the bounds of the board and has
// at least one empty cell
function isValidColumn(col: number) {
  if (col < 0 || col >= BOARD_WIDTH) return false
  return get(boardStore)[col].some((row) => row === Cell.EMPTY)
}

// add the given marker to the first empty cell in the given column
// returns true or false depending on if the move was made
function placeMarker(col: number, marker: Cell.RED | Cell.YELLOW) {
  if (!isValidColumn(col)) return false
  boardStore.update((board) => {
    const row = board[col].findIndex((cell) => cell === Cell.EMPTY)
    board[col][row] = marker
    return board
  })
  return true
}

export const board = {
  subscribe: boardStore.subscribe,
  createNewBoard,
  placeMarker,
  isValidColumn
}
