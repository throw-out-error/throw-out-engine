import { Program } from "./shader/program";
import { Mesh } from "./mesh";

export class Game {
  canvas: HTMLCanvasElement;
  gl!: WebGLRenderingContext;
  program!: Program;
  running: boolean;
  mesh!: Mesh;
  constructor(canvasId = "game") {
    this.canvas =
      <HTMLCanvasElement>document.getElementById(canvasId) ||
      document.createElement("canvas");
    this.running = true;
    this.run();
  }

  run() {
    console.log("Hello, game!");
    let gl = this.canvas.getContext("webgl");

    if (!gl) {
      return alert("Your browser does not support webgl.");
      // TODO: throw new Error?
    }

    this.gl = gl;

    this.gl.clearColor(0.75, 0.85, 0.8, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.program = new Program(this).compile();
    this.mesh = new Mesh(this);

    this.render();
  }

  render() {
    if (this.running) {
      this.mesh.render();
      requestAnimationFrame(this.render.bind(this));
    }
  }
}
