import type { Piece } from './board'

export const HUMAN = 0
export const AI = 1

export type PieceColor = 'red' | 'yellow'
export type Difficulty = 'easy' | 'medium' | 'hard'

export class Player {
  public piece: Piece
  public color: PieceColor
  public ai: boolean
  public difficulty: Difficulty

  constructor(piece: Piece, color: PieceColor, ai: boolean, difficulty?: Difficulty) {
    this.piece = piece
    this.color = color
    this.ai = ai
    this.difficulty = difficulty || 'medium'
  }

  setAi(ai: boolean) {
    this.ai = ai
  }

  setDifficulty(difficulty: Difficulty) {
    this.difficulty = difficulty
  }
}
