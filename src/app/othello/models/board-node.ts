import { BoardNodeState } from "../enums/board-node-state";
import { Direction } from "../enums/direction";

export class BoardNode {
    public isHover: boolean = false;

    private state: BoardNodeState = BoardNodeState.None;

    private upLeft: BoardNode | null = null;
    private upRight: BoardNode | null = null;
    private downLeft: BoardNode | null = null;
    private downRight: BoardNode | null = null;
    private up: BoardNode | null = null;
    private right: BoardNode | null = null;
    private down: BoardNode | null = null;
    private left: BoardNode | null = null;

    public getState(): BoardNodeState {
        return this.state;
    }

    public setState(state: BoardNodeState): void {
        this.state = state;
    }

    public getNode(direction: Direction): BoardNode | null {
        switch (direction) {
            case Direction.UpLeft:
                return this.upLeft;
            case Direction.UpRight:
                return this.upRight;
            case Direction.DownLeft:
                return this.downLeft;
            case Direction.DownRight:
                return this.downRight;

            case Direction.Up:
                return this.up;
            case Direction.Right:
                return this.right;
            case Direction.Down:
                return this.down;
            default:
                return this.left;
        }
    }

    public setNode(direction: Direction, node: BoardNode): void {
        switch (direction) {
            case Direction.UpLeft:
                this.upLeft = node;
                break;
            case Direction.UpRight:
                this.upRight = node;
                break;
            case Direction.DownLeft:
                this.downLeft = node;
                break;
            case Direction.DownRight:
                this.downRight = node;
                break;

            case Direction.Up:
                this.up = node;
                break;
            case Direction.Right:
                this.right = node;
                break;
            case Direction.Down:
                this.down = node;
                break;
            default:
                this.left = node;
                break;
        }
    }
}
