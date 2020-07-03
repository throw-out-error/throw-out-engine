import { Tensor } from "@throw-out-error/throw-out-utils";
import { ClientGame } from "../client/client-game";
import { createCube } from "./cube";
import { Program } from "../shader/program";
import { Entity } from "../common/entity/entity";

export type Geometry = {
  vertices: Tensor;
  colors: Tensor;
  indices: Tensor;
  buffers: {
    vertexBuffer: WebGLBuffer;
    colorBuffer: WebGLBuffer;
    indicesBuffer: WebGLBuffer;
  };
  draw(): void;
};

function getProjection(angle: number, a: number, zMin: number, zMax: number) {
  var ang = Math.tan((angle * 0.5 * Math.PI) / 180); //angle*.5
  return [
    0.5 / ang,
    0,
    0,
    0,
    0,
    (0.5 * a) / ang,
    0,
    0,
    0,
    0,
    -(zMax + zMin) / (zMax - zMin),
    -1,
    0,
    0,
    (-2 * zMax * zMin) / (zMax - zMin),
    0,
  ];
}

function rotateZ(t: Tensor, angle: number) {
  let m = t.getData();
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var mv0 = m[0],
    mv4 = m[4],
    mv8 = m[8];

  m[0] = c * m[0] - s * m[1];
  m[4] = c * m[4] - s * m[5];
  m[8] = c * m[8] - s * m[9];

  m[1] = c * m[1] + s * mv0;
  m[5] = c * m[5] + s * mv4;
  m[9] = c * m[9] + s * mv8;
}

function rotateX(t: Tensor, angle: number) {
  let m = t.getData();
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var mv1 = m[1],
    mv5 = m[5],
    mv9 = m[9];

  m[1] = m[1] * c - m[2] * s;
  m[5] = m[5] * c - m[6] * s;
  m[9] = m[9] * c - m[10] * s;

  m[2] = m[2] * c + mv1 * s;
  m[6] = m[6] * c + mv5 * s;
  m[10] = m[10] * c + mv9 * s;
}

function rotateY(t: Tensor, angle: number) {
  let m = t.getData();
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var mv0 = m[0],
    mv4 = m[4],
    mv8 = m[8];

  m[0] = c * m[0] + s * m[2];
  m[4] = c * m[4] + s * m[6];
  m[8] = c * m[8] + s * m[10];

  m[2] = c * m[2] - s * mv0;
  m[6] = c * m[6] - s * mv4;
  m[10] = c * m[10] - s * mv8;
}

export class Mesh {
  game: ClientGame;
  geometry: Geometry;
  program: Program;
  entity: Entity;
  movMatrix: Tensor<[4, 4]>;

  constructor(game: ClientGame, entity: Entity) {
    this.game = game;
    this.entity = entity;
    this.movMatrix = new Tensor(
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [4, 4],
    );
    this.program = new Program(this.game, this.entity.transform).compile();
    this.program.bind();
    this.geometry = createCube(this.game, this.program);
  }

  render() {
    const { gl } = this.game;
    const { position, rotation, scale } = this.entity.transform;
    let translation = this.program.getUniform("translation");
    let movMatrix = this.program.getUniform("movMatrix");
    let scaleMatrix = this.program.getUniform("scaleMatrix");

    gl.uniform3fv(translation, position.toFloatArray());

    // Rotation
    rotateX(this.movMatrix, rotation.x);
    rotateY(this.movMatrix, rotation.y);
    rotateZ(this.movMatrix, rotation.z);

    gl.uniformMatrix4fv(movMatrix, false, this.movMatrix.toFloatArray());

    // Scale
    gl.uniformMatrix4fv(
      scaleMatrix,
      false,
      new Float32Array([
        scale.x,
        0.0,
        0.0,
        0.0,
        0.0,
        scale.y,
        0.0,
        0.0,
        0.0,
        0.0,
        scale.z,
        0.0,
        0.0,
        0.0,
        0.0,
        1.0,
      ]),
    );
    this.geometry.draw();
  }
}
