import { ClientGame } from "./client/client-game";

window.onload = () => {
  const game = new ClientGame();
  game.run();
};
