import { Shader, ShaderType } from "./shader";
import { Game } from "../game";

export class Program {
  vertexShader: Shader;
  fragmentShader: Shader;
  game: Game;
  program?: WebGLProgram;
  constructor(game: Game) {
    this.game = game;
    this.vertexShader = new Shader(game, ShaderType.VERTEX);
    this.fragmentShader = new Shader(game, ShaderType.FRAGMENT);
  }

  compile(): Program {
    const { gl } = this.game;
    let vShader= this.vertexShader.compile();
    let fShader = this.fragmentShader.compile();

    this.program = gl.createProgram()!;
    gl.attachShader(this.program, vShader);
    gl.attachShader(this.program, fShader);
    gl.linkProgram(this.program);

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
}
