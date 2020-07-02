import { Entity } from "./entity/entity";

export class World {
  getEntities(): Map<string, Entity> {
    throw new Error("not implemented");
  }
}

export interface Game {
  update(): void;
  render(): void;
  getEntities(): Map<string, Entity>;
}