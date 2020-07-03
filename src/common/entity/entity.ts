import { Game } from "../world";
import { Tensor, Vector } from "@throw-out-error/throw-out-utils";
import cuid from "cuid";

export abstract class Entity {
  protected game: Game;
  transform: Transform;
  id: string;

  constructor(game: Game) {
    this.game = game;
    this.transform = Transform.create();
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
   * Creates an empty transform filled with zeroes.
   */
  static create(): Transform {
    return new Transform(
      Tensor.VECTOR_ZERO.clone(),
      Tensor.VECTOR_ZERO.clone(),
      Tensor.from(1, 1, 1),
    );
  }

  constructor(pos: Tensor<Vector>, rot: Tensor<Vector>, scale: Tensor<Vector>) {
    this.position = pos;
    this.rotation = rot;
    this.scale = scale;
  }

  clone(): Transform {
    return new Transform(this.position, this.rotation, this.scale);
  }
}
