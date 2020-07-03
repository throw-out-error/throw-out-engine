import { Tensor } from "@throw-out-error/throw-out-utils";
import { ClientGame } from "../client/client-game";
import { Program } from "../shader/program";

export function createCube(game: ClientGame, program: Program) {
  const vertices = new Tensor(
    [
      -1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      -1,
      -1,
      -1,
      1,
      1,
      -1,
      1,
      1,
      1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      1,
      1,
      1,
      1,
      -1,
      1,
      -1,
      -1,
      -1,
      -1,
      -1,
      1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      -1,
    ],
    [3, 4, 6],
  );

  let vertexBuffer = game.createBuffer(
    vertices.getData(),
    game.gl.ARRAY_BUFFER,
  );
  game.setBuffer(program, vertexBuffer, "vertPosition");

  const faceColors = new Tensor(
    [
      1.0,
      1.0,
      1.0,
      1.0, // Front face: white
      1.0,
      0.0,
      0.0,
      1.0, // Back face: red
      0.0,
      1.0,
      0.0,
      1.0, // Top face: green
      0.0,
      0.0,
      1.0,
      1.0, // Bottom face: blue
      1.0,
      1.0,
      0.0,
      1.0, // Right face: yellow
      1.0,
      0.0,
      1.0,
      1.0, // Left face: purple
    ],
    [4, 6],
  );

  let colorBuffer = game.createBuffer(
    faceColors.getData(),
    game.gl.ARRAY_BUFFER,
  );
  game.setBuffer(program, colorBuffer, "vertColor");

  const indices = new Tensor(
    [
      0,
      1,
      2,
      0,
      2,
      3,
      4,
      5,
      6,
      4,
      6,
      7,
      8,
      9,
      10,
      8,
      10,
      11,
      12,
      13,
      14,
      12,
      14,
      15,
      16,
      17,
      18,
      16,
      18,
      19,
      20,
      21,
      22,
      20,
      22,
      23,
    ],
    [3, 12],
  );

  let indicesBuffer = game.createBuffer(
    new Uint16Array(indices.getData()),
    game.gl.ELEMENT_ARRAY_BUFFER,
  );
  game.gl.bufferData(
    game.gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices.getData()),
    game.gl.STATIC_DRAW,
  );

  return {
    vertices,
    colors: faceColors,
    indices,
    buffers: { vertexBuffer, colorBuffer, indicesBuffer },
    draw: () => {
      // Tell WebGL which indices to use to index the vertices
      game.gl.bindBuffer(game.gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
      const vertexCount = indices.getData().length;
      // console.log(vertexCount);
      const type = game.gl.UNSIGNED_SHORT;
      const offset = 0;
      game.gl.drawElements(game.gl.TRIANGLES, vertexCount, type, offset);
    },
  };
}
