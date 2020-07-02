import { Tensor } from "@throw-out-error/throw-out-utils";
import { ClientGame } from "../client/client-game";

export class Mesh {
  game: ClientGame;
  vertices: Tensor;
  colors: Tensor;
  indices: Tensor;
  constructor(game: ClientGame) {
    this.game = game;
    this.vertices = new Tensor(
      [1.0, -1.0, 0.0, -1.0, -1.0, 0.0, 0.0, 1.0, 0.0],
      [3, 3],
    );
    this.colors = new Tensor(
      [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0],
      [3, 3],
    );
    this.indices = Tensor.from(0, 1, 2);

    this.compile();
  }

  compile() {}

  render() {
    const { gl, createBuffer, setBuffer } = this.game;

    let positionBuffer = createBuffer(this.vertices.data, gl.ARRAY_BUFFER);
    let colorBuffer = createBuffer(this.colors.data, gl.ARRAY_BUFFER);
    let indexBuffer = createBuffer(this.indices.data, gl.ELEMENT_ARRAY_BUFFER);

    setBuffer(positionBuffer, "vertPosition");
    setBuffer(colorBuffer, "vertColor");
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.vertices.size[0], gl.FLOAT, 0);
  }
}
