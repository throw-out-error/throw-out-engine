import { Game, World } from "../common/world";
import { Player } from "../common/entity/player";
import { Entity } from "../common/entity/entity";
import { Mesh } from "../mesh/mesh";
import { Program } from "../shader/program";
import { Tensor } from "@throw-out-error/throw-out-utils";

export class ClientGame implements Game {
  player!: Player;
  private entities: Map<string, Entity>;
  canvas: HTMLCanvasElement;
  gl!: WebGLRenderingContext;
  private running = false;
  mesh!: Mesh;

  constructor(canvasId = "game") {
    this.canvas =
      <HTMLCanvasElement>document.getElementById(canvasId) ||
      document.createElement("canvas");
    this.entities = new Map();
  }

  getWorld(): World {
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

    this.player = new Player(this, "test");
    this.player.transform.position = Tensor.from(0, 0, 0);
    this.mesh = new Mesh(this, this.player);

    this.running = true;
    this.render.bind(this)();
  }

  render() {
    if (this.running) {
      this.gl.clearColor(0.75, 0.85, 0.8, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      this.update();
      this.mesh.render();
      this.player.transform.rotation.y = 0.1;

      requestAnimationFrame(this.render.bind(this));
    }
  }

  update() {
    for (let e of this.entities.values()) {
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

  setBuffer(program: Program, buf: WebGLBuffer, name: string) {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    let loc = gl.getAttribLocation(program.program!, name);
    gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 4 * 3, 0);
    gl.enableVertexAttribArray(loc);
  }
}
