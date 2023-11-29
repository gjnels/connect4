import type { Piece } from './board'

export const HUMAN = 0
export const AI = 1

export type PieceColor = 'red' | 'yellow'

export class Player {
  public piece: Piece
  public color: PieceColor
  public ai: boolean

  constructor(piece: Piece, color: PieceColor, ai = false) {
    this.piece = piece
    this.color = color
    this.ai = ai
  }
}
