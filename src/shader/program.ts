import { Shader, ShaderType } from "./shader";
import { ClientGame } from "../client/client-game";

export class Program {
  vertexShader: Shader;
  fragmentShader: Shader;
  game: ClientGame;
  program?: WebGLProgram;
  constructor(game: ClientGame) {
    this.game = game;
    this.vertexShader = new Shader(game, ShaderType.VERTEX);
    this.fragmentShader = new Shader(game, ShaderType.FRAGMENT);
  }

  compile(): Program {
    const { gl, createProgram } = this.game;
    let vShader = this.vertexShader.compile();
    let fShader = this.fragmentShader.compile();

    this.program = createProgram.bind(this.game)([vShader, fShader]);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(
        "Error linking program!",
        gl.getProgramInfoLog(this.program),
      );
      return this;
    }

    gl.validateProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS)) {
      console.error(
        "Error validating program!",
        gl.getProgramInfoLog(this.program),
      );
      return this;
    }

    return this;
  }

  bind() {
    this.game.gl.useProgram(this.program!);
  }
}
