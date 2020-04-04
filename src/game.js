import boardGenerator from "./utils/boardGenerator.js";
export default function createGame() {
  let state = {
    observers: [],
    gameData: {
      level: 1,
      player: {
        x: 1.5,
        y: 1.5,
      },
      board: [],
      boardWidth: 13,
      boardHeight: 13,
    },
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

  function initialize() {
    const boardWidth = 13;
    const boardHeight = 13;
    const board = boardGenerator(state.gameData.level, boardWidth, boardHeight);
    setGameData({
      boardWidth,
      boardHeight,
      board,
      player: {
        x: 1.5,
        y: 1.5,
      },
      level: 1,
    });
  }

  function setGameData(gameData) {
    state.gameData = gameData;
    notifyAll({
      type: "render",
      data: {
        screen: "boardScreen",
        buttonText: "Restart!",
        buttonAction: "startScreen",
        gameData,
      },
    });
  }

  function movePlayer({ keyPressed }) {
    const acceptedMoves = {
      ArrowUp(player) {
        player.y = player.y - 0.5;
      },
      ArrowRight(player) {
        player.x = player.x + 0.5;
      },
      ArrowDown(player) {
        player.y = player.y + 0.5;
      },
      ArrowLeft(player) {
        player.x = player.x - 0.5;
      },
    };

    const moveFunction = acceptedMoves[keyPressed];

    if (moveFunction) {
      moveFunction(state.gameData.player);
      setGameData(state.gameData)
    }
  }

  function eventHandler(command) {
    const acceptedCommands = {
      movePlayer,
    };

    const commandFunction = acceptedCommands[command.type];

    if (commandFunction) {
      console.log(`Game received: ${command.type}`);
      commandFunction(command.data);
    }
  }

  return {
    initialize,
    unsubscribeAll,
    subscribe,
    eventHandler,
  };
}
