import { Component } from '@angular/core';
import { BoardNodeState } from '../../enums/board-node-state';
import { BoardNode } from '../../models/board-node';
import { Direction } from '../../enums/direction';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.less']
})
export class BoardComponent {
  board: BoardNode[][] = [];
  turn: BoardNodeState;
  winner: BoardNodeState;
  modal: Modal | null= null;

  constructor() {
    this.turn = BoardNodeState.Black;
    this.winner = BoardNodeState.None;
    this.initializeBoard();
  }

  /**
   * Places a piece at the given (i, j) coordinate.
   * Flips over other pieces if need be as well.
   * @param i Horizontal 0-based index
   * @param j Vertical 0-based index
   * @returns 
   */
  public placePiece(i: number, j: number): void {
    if (this.board[i][j].getState() !== BoardNodeState.None) return;

    this.board[i][j].setState(this.turn);

    this.updatePieces(i, j);

    if (this.isBoardFull()) {
      let blackScore = this.getBlackScore();
      let whiteScore = this.getWhiteScore();

      if(blackScore > whiteScore) {
        this.winner = BoardNodeState.Black;
      }
      else if(whiteScore > blackScore) {
        this.winner = BoardNodeState.White;
      }
      else {
        this.winner = BoardNodeState.None;
      }

      const element = document.getElementById("winnerModal") as HTMLElement;
      this.modal = new Modal(element, {
        backdrop: "static"
      });
      this.modal.show();

      return;
    }

    if (this.turn === BoardNodeState.Black) {
      this.turn = BoardNodeState.White;
    }
    else {
      this.turn = BoardNodeState.Black;
    }
  }

  /**
   * Returns string representation of the given node's state
   * (Black return 'black', White returns 'white', otherwise '').
   * @param node the node in question
   * @returns Black returns 'black'. White returns 'white'. Otherwise ''.
   */
  public getPieceClass(node: BoardNode): string {
    if (node.getState() == BoardNodeState.Black) {
      return "black";
    }

    if (node.getState() == BoardNodeState.White) {
      return "white";
    }

    return "";
  }

  /**
   * Returns string representation of the current player's color
   * (Black return 'black', White returns 'white', otherwise '').
   * Ignores nodes that already have a piece.
   * @param node the node in question
   * @returns Black returns 'black'. White returns 'white'. Otherwise ''.
   */
  public getTurnClass(node: BoardNode): string {
    if (node.getState() !== BoardNodeState.None) return "";

    if (this.turn == BoardNodeState.Black) {
      return "black";
    }

    if (this.turn == BoardNodeState.White) {
      return "white";
    }

    return "";
  }

  /**
   * Returns a string represention of the current turn's color
   * (ex: Black returns Black). This is for displaying the
   * name of whoever's turn it is.
   * @returns Black if its black's turn. White otherwise.
   */
  public getTurnName(): string {
    if (this.turn == BoardNodeState.Black) {
      return "Black";
    }
    return "White";
  }

  /**
   * Counts the number of black pieces on the board.
   * @returns The number of black pieces on the board
   */
  public getBlackScore(): number {
    return this.getColorScore(BoardNodeState.Black);
  }

  /**
   * Counts the number of white pieces on the board.
   * @returns The number of white pieces on the board
   */
  public getWhiteScore(): number {
    return this.getColorScore(BoardNodeState.White);
  }

  public getWinnerText(): string {
    if(this.winner == BoardNodeState.Black) {
      return "Black wins!!!";
    }

    if(this.winner == BoardNodeState.White) {
      return "White wins!!!";
    }

    return "It's a tie!";
  }

  public startOver(): void {
    this.turn = BoardNodeState.Black;
    this.winner = BoardNodeState.None;
    this.initializeBoard();
    this.modal!.hide();
  }

  /**
   * Initializes the board 2D array (and 8x8 grid).
   * This middle four will be black and white alternating.
   */
  private initializeBoard(): void {
    for (let i = 0; i < 8; i++) {
      this.board[i] = [];

      for (let j = 0; j < 8; j++) {
        this.board[i][j] = new BoardNode();
      }
    }

    this.board[3][3].setState(BoardNodeState.Black);
    this.board[4][3].setState(BoardNodeState.White);
    this.board[3][4].setState(BoardNodeState.White);
    this.board[4][4].setState(BoardNodeState.Black);

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (i > 0) {
          this.board[i][j].setNode(Direction.Left, this.board[i - 1][j]);
        }

        if (i < 7) {
          this.board[i][j].setNode(Direction.Right, this.board[i + 1][j]);
        }

        if (j > 0) {
          this.board[i][j].setNode(Direction.Up, this.board[i][j - 1]);
        }

        if (j < 7) {
          this.board[i][j].setNode(Direction.Down, this.board[i][j + 1]);
        }

        if (i > 0 && j > 0) {
          this.board[i][j].setNode(Direction.UpLeft, this.board[i - 1][j - 1]);
        }

        if (i > 0 && j < 7) {
          this.board[i][j].setNode(Direction.DownLeft, this.board[i - 1][j + 1]);
        }

        if (i < 7 && j > 0) {
          this.board[i][j].setNode(Direction.UpRight, this.board[i + 1][j - 1]);
        }

        if (i < 7 && j < 7) {
          this.board[i][j].setNode(Direction.DownRight, this.board[i + 1][j + 1]);
        }
      }
    }
  }

  /**
   * When a piece is placed, this will check which other pieces'
   * colors will need to change (if it is black's turn then all
   * white pieces between the placed piece and other black pieces
   * will swap over to black (ex: bwwwb -> bbbbb)).
   * @param i horizontal 0-based index
   * @param j vertical 0-based index
   */
  private updatePieces(i: number, j: number): void {
    this.updateDirection(i, j, Direction.UpLeft);
    this.updateDirection(i, j, Direction.Up);
    this.updateDirection(i, j, Direction.UpRight);
    this.updateDirection(i, j, Direction.Right);
    this.updateDirection(i, j, Direction.DownRight);
    this.updateDirection(i, j, Direction.Down);
    this.updateDirection(i, j, Direction.DownLeft);
    this.updateDirection(i, j, Direction.Left);
  }

  /**
   * Checks all pieces in the direction given to see if any of them
   * need to change. If it is black's turn then white pieces will
   * need to change if there are white pieces between the placed piece
   * and another black piece in the direction given (ex: bwwwb -> bbbbb)).
   * @param i horizontal 0-based index
   * @param j vertical 0-based index
   * @param direction the direction to check in (UpLeft, Left, etc.)
   * @returns True if the direction given has pieces that need to update. False otherwise.
   */
  private willDirectionUpdate(i: number, j: number, direction: Direction): boolean {
    let node = this.board[i][j].getNode(direction);

    while (node !== null && node.getState() !== BoardNodeState.None && node.getState() !== this.turn) {
      node = node.getNode(direction);
    }

    return node !== null && node.getState() !== BoardNodeState.None && node.getState() === this.turn;
  }

  /**
   * Flips over pieces in the direction given. If it is black's turn
   * then white pieces will be changed to be black instead.
   * @param i horizontal 0-based index
   * @param j vertical 0-based index
   * @param direction the direction to change pieces in (UpLeft, Left, etc.)
   */
  private updateDirection(i: number, j: number, direction: Direction): void {
    if (!this.willDirectionUpdate(i, j, direction)) return;

    let node = this.board[i][j].getNode(direction);

    while (node !== null && node.getState() !== BoardNodeState.None && node.getState() !== this.turn) {
      node.setState(this.turn);
      node = node.getNode(direction);
    }
  }

  /**
   * Counts the number of pieces on the board that are the
   * given color.
   * @param color The color to calculate the score for
   * @returns The number of pieces of the given color on the board
   */
  private getColorScore(color: BoardNodeState): number {
    let score = 0;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j].getState() == color) {
          score++;
        }
      }
    }

    return score;
  }

  /**
   * Checks whether or not the board is completely full.
   * @returns True if the board is completely full. False otherwise.
   */
  private isBoardFull(): boolean {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j].getState() === BoardNodeState.None) {
          return false;
        }
      }
    }

    return true;
  }
}