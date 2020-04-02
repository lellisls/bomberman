import boardGenerator from "./utils/boardGenerator.js";
export default function createGame() {
  let state = {
    level: 1,
    observers: []
  };

  function subscribe(observerFunction) {
    state.observers.push(observerFunction);
  }

  function unsubscribeAll() {
    state.observers = [];
  }

  function notifyAll(command) {
    console.log("Game: ", command);
    for (const observerFunction of state.observers) {
      observerFunction(command);
    }
  }

  function eventHandler(command) {}

  function initialize() {
    const boardWidth = 13;
    const boardHeight = 13;
    const board = boardGenerator(state.level, boardWidth, boardHeight);
    notifyAll({
      type: "render",
      data: {
        screen: "boardScreen",
        buttonText: "Restart!",
        buttonAction: "startScreen",
        gameData: {
          board,
          boardWidth,
          boardHeight
        },
        level: state.level
      }
    });
  }

  return {
    initialize,
    unsubscribeAll,
    subscribe,
    eventHandler
  };
}
