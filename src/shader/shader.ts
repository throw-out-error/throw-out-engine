import { ClientGame } from "../client/client-game";
import { Transform } from "../common/entity/entity";

export enum ShaderType {
  VERTEX,
  FRAGMENT,
}

// TODO: gl programs & single shader class (shader types)
export class Shader {
  shaderText: string;
  type: ShaderType;
  game: ClientGame;
  transform: Transform;

  constructor(game: ClientGame, type: ShaderType, transform: Transform) {
    this.game = game;
    this.type = type;
    this.transform = transform;
    if (type === ShaderType.VERTEX) {
      this.shaderText = `
      precision mediump float;
      uniform vec3 translation;
      uniform mat4 movMatrix;
      uniform mat4 scaleMatrix;
      attribute vec3 vertPosition;
      attribute vec3 vertColor;
      varying vec3 fragColor;
      
      void main() {
        fragColor = vertColor;
        gl_Position = scaleMatrix * movMatrix * vec4(vertPosition, 1.0) + vec4(translation, 0.0);
      }
      `;
    } else {
      this.shaderText = `
      precision mediump float;  
      varying vec3 fragColor;
      void main() {
        gl_FragColor = vec4(fragColor, 1.0);
      }
      `;
    }
  }

  compile(): WebGLShader {
    const { gl, createShader } = this.game;
    return createShader.bind(this.game)(
      this.shaderText,
      this.type == ShaderType.VERTEX ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER,
    );
  }
}
