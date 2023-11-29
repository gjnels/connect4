import { get, writable, type Subscriber, type Writable } from 'svelte/store'

export const ROW_COUNT = 6
export const COLUMN_COUNT = 7

export enum Cell {
  EMPTY,
  PLAYER_1,
  PLAYER_2
}

export type Piece = Cell.PLAYER_1 | Cell.PLAYER_2

function createEmptyBoard(): Cell[][] {
  const board: Cell[][] = []
  for (let r = 0; r < ROW_COUNT; r++) {
    board.push(Array(COLUMN_COUNT).fill(Cell.EMPTY))
  }
  return board
}

function checkForHorizontalWin(board: Cell[][]) {
  for (let r = 0; r < ROW_COUNT; r++) {
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
      if (
        board[r][c] !== Cell.EMPTY &&
        board[r][c] === board[r][c + 1] &&
        board[r][c] === board[r][c + 2] &&
        board[r][c] === board[r][c + 3]
      ) {
        return {
          player: board[r][c],
          cells: [
            [r, c],
            [r, c + 1],
            [r, c + 2],
            [r, c + 3]
          ]
        }
      }
    }
  }
  return false
}

function checkForVerticalWin(board: Cell[][]) {
  for (let r = 0; r < ROW_COUNT - 3; r++) {
    for (let c = 0; c < COLUMN_COUNT; c++) {
      if (
        board[r][c] !== Cell.EMPTY &&
        board[r][c] === board[r + 1][c] &&
        board[r][c] === board[r + 2][c] &&
        board[r][c] === board[r + 3][c]
      ) {
        return {
          player: board[r][c],
          cells: [
            [r, c],
            [r + 1, c],
            [r + 2, c],
            [r + 3, c]
          ]
        }
      }
    }
  }
  return false
}

function checkForDiagonalUpWin(board: Cell[][]) {
  for (let r = 0; r < ROW_COUNT - 3; r++) {
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
      if (
        board[r][c] !== Cell.EMPTY &&
        board[r][c] === board[r + 1][c + 1] &&
        board[r][c] === board[r + 2][c + 2] &&
        board[r][c] === board[r + 3][c + 3]
      ) {
        return {
          player: board[r][c],
          cells: [
            [r, c],
            [r + 1, c + 1],
            [r + 2, c + 2],
            [r + 3, c + 3]
          ]
        }
      }
    }
  }
  return false
}

function checkForDiagonalDownWin(board: Cell[][]) {
  for (let r = 3; r < ROW_COUNT; r++) {
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
      if (
        board[r][c] !== Cell.EMPTY &&
        board[r][c] === board[r - 1][c + 1] &&
        board[r][c] === board[r - 2][c + 2] &&
        board[r][c] === board[r - 3][c + 3]
      ) {
        return {
          player: board[r][c],
          cells: [
            [r, c],
            [r - 1, c + 1],
            [r - 2, c + 2],
            [r - 3, c + 3]
          ]
        }
      }
    }
  }
  return false
}

export class Board {
  public state: Writable<Cell[][]>

  constructor(state?: Cell[][]) {
    this.state = writable(state || createEmptyBoard())
  }

  reset() {
    this.state.set(createEmptyBoard())
  }

  copy() {
    return get(this.state).map((row) => row.map((cell) => cell))
  }

  print() {
    let output = '\n'
    const c_sep = '|'
    const r_sep = '-'
    for (let r = ROW_COUNT - 1; r >= 0; r--) {
      for (let c = 0; c < COLUMN_COUNT; c++) {
        output += c_sep + ' ' + get(this.state)[r][c] + ' '
      }
      output += c_sep + '\n' // end of row
      for (let c = 0; c < COLUMN_COUNT; c++) {
        output += c_sep + r_sep + r_sep + r_sep
      }
      output += c_sep + '\n' // end of separator row
    }
    output += '\n'
    console.log(output)
  }

  placePiece(piece: Piece, column: number) {
    const row = this.getNextOpenRow(column)
    if (row !== undefined) {
      this.state.update((state) => {
        state[row][column] = piece
        return state
      })
      return true
    }
    return false
  }

  isValidLocation(column: number) {
    return get(this.state)[ROW_COUNT - 1][column] === Cell.EMPTY
  }

  getValidLocations() {
    const locations = []
    for (let c = 0; c < COLUMN_COUNT; c++) {
      if (this.isValidLocation(c)) locations.push(c)
    }
    return locations
  }

  getNextOpenRow(column: number) {
    for (let r = 0; r < ROW_COUNT; r++) {
      if (get(this.state)[r][column] === Cell.EMPTY) {
        return r
      }
    }
  }

  isEmpty() {
    const state = get(this.state)
    for (let r = 0; r < ROW_COUNT; r++) {
      for (let c = 0; c < COLUMN_COUNT; c++) {
        if (state[r][c] !== Cell.EMPTY) {
          return false
        }
      }
    }
    return true
  }

  isFull() {
    const state = get(this.state)
    for (let r = 0; r < ROW_COUNT; r++) {
      for (let c = 0; c < COLUMN_COUNT; c++) {
        if (state[r][c] === Cell.EMPTY) {
          return false
        }
      }
    }
    return true
  }

  checkForWinner() {
    const state = get(this.state)
    return (
      checkForHorizontalWin(state) ||
      checkForVerticalWin(state) ||
      checkForDiagonalUpWin(state) ||
      checkForDiagonalDownWin(state)
    )
  }

  subscribe(run: Subscriber<Cell[][]>) {
    return this.state.subscribe(run)
  }
}
