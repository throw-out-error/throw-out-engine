import { Entity } from "./entity";
import { Game } from "../world";

export class Player extends Entity {
  connectionId: string;
  constructor(game: Game, socketId: string) {
    super(game);
    this.connectionId = socketId;
  }

  update(): void {
    // Socket stuff
  }
}
