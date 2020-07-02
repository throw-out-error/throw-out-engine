import { Game, World } from "../common/world";
import { Player } from "../common/entity/player";
import { Entity } from "../common/entity/entity";
import { Mesh } from "../mesh/mesh";
import { Program } from "../shader/program";

export class ClientGame implements Game {
  player?: Player;
  private entities: Map<string, Entity>;
  canvas: HTMLCanvasElement;
  gl!: WebGLRenderingContext;
  program!: Program;
  private running = false;
  mesh!: Mesh;

  constructor(canvasId = "game") {
    this.canvas =
      <HTMLCanvasElement>document.getElementById(canvasId) ||
      document.createElement("canvas");
    this.entities = new Map();
  }

  getWorld(): World {
    if (!this.player)
      throw new Error(
        "The current player has not yet been assigned. Maybe the player has not joined a game yet.",
      );
    console.trace("This feature has not been implemented yet.");
    return new World();
  }

  getEntities(): Map<string, Entity> {
    return this.entities;
  }

  run() {
    console.log("Hello, game!");
    let gl = this.canvas.getContext("webgl");

    if (!gl) {
      return alert("Your browser does not support webgl.");
      // TODO: throw new Error?
    }

    this.gl = gl;

    this.program = new Program(this).compile();
    this.program.bind();
    this.mesh = new Mesh(this);

    this.running = true;
    this.render();
  }

  render() {
    if (this.running) {
      this.gl.clearColor(0.75, 0.85, 0.8, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      this.update();
      this.mesh.render.bind(this);
      
      requestAnimationFrame(this.render.bind(this));
    }
  }

  update() {
    for(let e of this.entities.values()) {
      e.update();
    }
  }

  createBuffer(arr: any, bufType: number): WebGLBuffer {
    const { gl } = this;
    // ⚪ Create Buffer
    let buf = gl.createBuffer();
    gl.bindBuffer(bufType, buf);
    // 💾 Push data to VBO
    gl.bufferData(bufType, arr, gl.STATIC_DRAW);
    return buf!;
  }

  createShader(source: string, stage: any) {
    const { gl } = this;
    // ⚪ Create Shader
    let s = gl.createShader(stage)!;
    // 📰 Pass Vertex Shader String
    gl.shaderSource(s, source);
    // 🔨 Compile Vertex Shader (and check for errors)
    gl.compileShader(s);
    // ❔ Check if shader compiled correctly
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(
        "An error occurred compiling the shader: " + gl.getShaderInfoLog(s),
      );
    }
    return s;
  }

  createProgram(stages: WebGLShader[]) {
    const { gl } = this;

    let p = gl.createProgram()!;
    for (let stage of stages) {
      gl.attachShader(p, stage);
    }
    gl.linkProgram(p);
    return p;
  }

  setBuffer(buf: WebGLBuffer, name: string) {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    let loc = gl.getAttribLocation(this.program.program!, name);
    gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 4 * 3, 0);
    gl.enableVertexAttribArray(loc);
  }
}
