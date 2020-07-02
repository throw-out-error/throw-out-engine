import { Game } from "../world";
import { Tensor, Vector } from "@throw-out-error/throw-out-utils";
import cuid from "cuid";

export abstract class Entity {
  protected game: Game;
  transform: Transform;
  id: string;

  constructor(game: Game) {
    this.game = game;
    this.transform = new Transform();
    this.id = cuid();
  }

  getGame(): Game {
    return this.game;
  }

  abstract update(): void;
}

export class Transform {
  position: Tensor<Vector>;
  rotation: Tensor<Vector>;
  scale: Tensor<Vector>;

  /**
   * Creates a transform filled with zeroes.
   */
  constructor() {
    this.position = Tensor.VECTOR_ZERO.clone();
    this.rotation = Tensor.VECTOR_ZERO.clone();
    this.scale = Tensor.VECTOR_ZERO.clone();
  }
}
