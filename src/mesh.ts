import { Game } from "./game";
import { Tensor } from "@throw-out-error/throw-out-utils";

export class Mesh {
  vertices: Tensor;
  colors: Tensor;
  game: Game;
  vertexBuffer: WebGLBuffer | undefined;
  constructor(game: Game) {
    this.game = game;
    this.vertices = new Tensor([0.0, 0.5, -0.5, -0.5, 0.5, -0.5], [3, 2]);
    this.colors = new Tensor(
      [1.0, 1.0, 0.0, 0.7, 0.0, 1.0, 0.1, 1.0, 0.6],
      [3, 3],
    );
    this.compile();
  }

  compile() {
    const { gl, program } = this.game;

    this.vertexBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices.data, gl.STATIC_DRAW);

    let positionAttribLocation = gl.getAttribLocation(
      program.program!,
      "vertPosition",
    );
    gl.vertexAttribPointer(
      positionAttribLocation, // Attribute location,
      2, // Number of elements per attribute
      gl.FLOAT, // Type of elements
      false,
      2 * Float32Array.BYTES_PER_ELEMENT, // Size of individual vertex
      0, // Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(positionAttribLocation);

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors.data, gl.STATIC_DRAW);

    let colorAttribLocation = gl.getAttribLocation(
      program.program!,
      "vertColor",
    );
    gl.vertexAttribPointer(
      colorAttribLocation,
      this.colors.size[0],
      gl.FLOAT,
      false,
      this.colors.size[1] * Float32Array.BYTES_PER_ELEMENT,
      0,
    );
    gl.enableVertexAttribArray(colorAttribLocation);
  }

  render() {
    const { gl, program } = this.game;
    gl.useProgram(program.program!);
    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.size[0]);
  }
}
