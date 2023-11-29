import { Board, Cell, ROW_COUNT, type Piece, COLUMN_COUNT } from '$lib'
import { get } from 'svelte/store'

function count(cells: Cell[], cell: Cell) {
  return cells.reduce((count, current) => (current === cell ? count + 1 : count), 0)
}

function getColumn(board: Cell[][], column: number) {
  return board.slice().map((row) => row[column])
}

// check an array of 4 board cells in a row and score it based on the given piece
function evaluateWindow(window: Cell[], piece: Piece) {
  const opponentPiece = piece === Cell.PLAYER_1 ? Cell.PLAYER_2 : Cell.PLAYER_1
  const currentCount = count(window, piece)
  const opponentCount = count(window, opponentPiece)
  const emptyCount = count(window, Cell.EMPTY)
  // winning move
  if (currentCount === 4) {
    return 100001
  }
  // one move away from a win
  if (currentCount === 3 && emptyCount === 1) {
    return 1000
  }
  // two moves away from a win
  if (currentCount === 2 && emptyCount === 2) {
    return 100
  }

  // opponent is one move away from a win
  // one move away from a win
  // winning move
  if (opponentCount === 4) {
    return -100000
  }
  // one move away from a win
  if (opponentCount === 3 && emptyCount === 1) {
    return -1001 // prefer to block opponent
  }
  // two moves away from a win
  if (opponentCount === 2 && emptyCount === 2) {
    return -101 // prefer to block opponent
  }

  // one of the following:
  // - row is empty
  // - row has one piece which is current piece
  // - row has one or two opponent pieces with the rest empty
  return 0
}

function scorePosition(board: Cell[][], piece: Piece) {
  let score = 0

  // score horizontal
  for (let row = 0; row < ROW_COUNT; row++) {
    for (let column = 0; column < COLUMN_COUNT - 3; column++) {
      const window = board[row].slice(column, column + 4)
      score += evaluateWindow(window, piece)
    }
  }

  // score vertical
  for (let column = 0; column < COLUMN_COUNT; column++) {
    for (let row = 0; row < ROW_COUNT - 3; row++) {
      const window = getColumn(board, column).slice(row, row + 4)
      score += evaluateWindow(window, piece)
    }
  }

  // score diagonal up
  for (let row = 0; row < ROW_COUNT - 3; row++) {
    for (let column = 0; column < COLUMN_COUNT - 3; column++) {
      const window = [
        board[row][column],
        board[row + 1][column + 1],
        board[row + 2][column + 2],
        board[row + 3][column + 3]
      ]
      score += evaluateWindow(window, piece)
    }
  }

  // score diagonal down
  for (let row = 3; row < ROW_COUNT; row++) {
    for (let column = 0; column < COLUMN_COUNT - 3; column++) {
      const window = [
        board[row][column],
        board[row - 1][column + 1],
        board[row - 2][column + 2],
        board[row - 3][column + 3]
      ]
      score += evaluateWindow(window, piece)
    }
  }

  return score
}

export function getBestMove(board: Board, depth: number, piece: Piece) {
  const [column] = minimax(board, depth, -Infinity, Infinity, true, piece)
  if (column === null) {
    console.log(`Player ${piece}: NO BEST COLUMN FOUND`)
    const locations = board.getValidLocations()
    return locations[Math.floor(Math.random() * locations.length)]
  }
  return column
}

export function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  piece: Piece
) {
  const winner = board.checkForWinner()
  if (winner) {
    if (winner.player === piece) {
      return [null, 1000000]
    } else {
      return [null, -1000000]
    }
  }

  if (board.isFull()) {
    return [null, 0]
  }

  if (depth === 0) {
    return [null, scorePosition(board.copy(), piece)]
  }

  const opponentPiece = piece === Cell.PLAYER_1 ? Cell.PLAYER_2 : Cell.PLAYER_1
  const validLocations = board.getValidLocations()
  let value = maximizing ? -Infinity : Infinity
  let column = validLocations[Math.floor(Math.random() * validLocations.length)]

  for (const col of validLocations) {
    const boardCopy = new Board(board.copy())
    boardCopy.placePiece(maximizing ? piece : opponentPiece, col)
    const newValue = minimax(boardCopy, depth - 1, alpha, beta, !maximizing, piece)[1]
    if (maximizing) {
      if (newValue && newValue > value) {
        value = newValue
        column = col
      }
      alpha = Math.max(alpha, value)
    } else {
      if (newValue && newValue < value) {
        value = newValue
        column = col
      }
      beta = Math.min(beta, value)
    }
    if (alpha >= beta) {
      break
    }
  }
  return [column, value]
}

// rudamentary ai
export function pickBestMove(board: Board, piece: Piece) {
  const locations = board.getValidLocations()
  let bestScore = -1000
  let bestColumn = locations[Math.floor(Math.random() * locations.length)]
  for (const column of locations) {
    const newBoard = new Board(board.copy())
    if (newBoard.placePiece(piece, column)) {
      const score = scorePosition(get(newBoard), piece)
      if (score > bestScore) {
        bestScore = score
        bestColumn = column
      }
    }
  }
  return bestColumn
}
