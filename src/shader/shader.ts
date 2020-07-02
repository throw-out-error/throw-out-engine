import { ClientGame } from "../client/client-game";

export enum ShaderType {
  VERTEX,
  FRAGMENT,
}

// TODO: gl programs & single shader class (shader types)
export class Shader {
  shaderText: string;
  type: ShaderType;
  game: ClientGame;

  constructor(game: ClientGame, type: ShaderType) {
    this.game = game;
    this.type = type;
    if (type === ShaderType.VERTEX) {
      this.shaderText = `
      precision mediump float;

      attribute vec2 vertPosition;
      attribute vec3 vertColor;
      varying vec3 fragColor;
      
      void main() {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
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
