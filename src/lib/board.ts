import { get, writable } from 'svelte/store'

export enum Cell {
  EMPTY,
  RED,
  YELLOW
}

export const BOARD_WIDTH = 7
export const BOARD_HEIGHT = 6

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

// check if there are no empty cells on the board
function isFull() {
  return get(boardStore).every((col) => col.every((cell) => cell !== Cell.EMPTY))
}

// determine if there are 4 pieces in a row of the same color horizontally
function checkForHorizontalWin() {
  for (let col = 0; col <= BOARD_WIDTH - 4; col++) {
    for (let cell = 0; cell < BOARD_HEIGHT; cell++) {
      if (get(board)[col][cell] === Cell.EMPTY) continue
      if (
        get(board)[col][cell] === get(board)[col + 1][cell] &&
        get(board)[col][cell] === get(board)[col + 2][cell] &&
        get(board)[col][cell] === get(board)[col + 3][cell]
      ) {
        return {
          winner: get(board)[col][cell],
          cells: [
            [col, cell],
            [col + 1, cell],
            [col + 2, cell],
            [col + 3, cell]
          ]
        }
      }
    }
  }
  return false
}

// determine if there are 4 pieces in a row of the same color vertically
function checkForVerticalWin() {
  for (let col = 0; col < BOARD_WIDTH; col++) {
    for (let cell = 0; cell <= BOARD_HEIGHT - 4; cell++) {
      if (get(board)[col][cell] === Cell.EMPTY) continue
      if (
        get(board)[col][cell] === get(board)[col][cell + 1] &&
        get(board)[col][cell] === get(board)[col][cell + 2] &&
        get(board)[col][cell] === get(board)[col][cell + 3]
      ) {
        return {
          winner: get(board)[col][cell],
          cells: [
            [col, cell],
            [col, cell + 1],
            [col, cell + 2],
            [col, cell + 3]
          ]
        }
      }
    }
  }
  return false
}

function checkForDiagonalWin() {
  for (let col = 0; col <= BOARD_WIDTH - 4; col++) {
    for (let cell = 0; cell <= BOARD_HEIGHT - 4; cell++) {
      if (get(board)[col][cell] === Cell.EMPTY) continue
      if (
        get(board)[col][cell] === get(board)[col + 1][cell + 1] &&
        get(board)[col][cell] === get(board)[col + 2][cell + 2] &&
        get(board)[col][cell] === get(board)[col + 3][cell + 3]
      )
        return {
          winner: get(board)[col][cell],
          cells: [
            [col, cell],
            [col + 1, cell + 1],
            [col + 2, cell + 2],
            [col + 3, cell + 3]
          ]
        }
    }
    for (let cell = 3; cell < BOARD_HEIGHT; cell++) {
      if (get(board)[col][cell] === Cell.EMPTY) continue
      if (
        get(board)[col][cell] === get(board)[col + 1][cell - 1] &&
        get(board)[col][cell] === get(board)[col + 2][cell - 2] &&
        get(board)[col][cell] === get(board)[col + 3][cell - 3]
      )
        return {
          winner: get(board)[col][cell],
          cells: [
            [col, cell],
            [col + 1, cell - 1],
            [col + 2, cell - 2],
            [col + 3, cell - 3]
          ]
        }
    }
  }
  return false
}

function checkForWin() {
  return checkForVerticalWin() || checkForHorizontalWin() || checkForDiagonalWin()
}

export const board = {
  subscribe: boardStore.subscribe,
  createNewBoard,
  placeMarker,
  isValidColumn,
  isFull,
  checkForWin
}
