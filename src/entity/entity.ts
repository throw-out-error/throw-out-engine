import { Game } from "../game";
import { Tensor, Vector } from "@throw-out-error/throw-out-utils";
export class Entity {
  game: Game;
  transform: Transform;
  constructor(game: Game) {
    this.game = game;
    this.transform = new Transform();
  }
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
