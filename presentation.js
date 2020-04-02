export default function createPresentation(canvas) {
  const context = canvas.getContext("2d");

  let state = {
    currentScreenData: null,
    buttons: new Map(),
    observers: []
  };

  function subscribe(observerFunction) {
    state.observers.push(observerFunction);
  }

  function unsubscribeAll() {
    state.observers = [];
  }

  function notifyAll(command) {
    console.log("Presentation: ", command);
    for (const observerFunction of state.observers) {
      observerFunction(command);
    }
  }

  function addButton(id, button) {
    state.buttons.set(id, button);
  }

  function recalculateSize(width, height) {
    canvas.height = height;
    canvas.width = width;
    render(state.currentScreenData);
  }

  function clearScreen() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    state.buttons.clear();
  }

  function drawGameBoard() {}

  function drawButton(text, id) {
    context.fillStyle = "#DDDDEE";
    context.shadowBlur = 10;
    context.shadowColor = "black";

    const rectWidth = 100;
    const rectHeight = 40;
    const button = new Path2D();
    button.rect(
      canvas.width - rectWidth - 10,
      canvas.height - rectHeight - 10,
      rectWidth,
      rectHeight
    );
    context.fill(button);
    addButton(id, button);

    context.fillStyle = "#333";
    context.shadowBlur = 0;
    context.font = "20px Verdana";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillText(
      text,
      canvas.width - rectWidth / 2 - 10,
      canvas.height - rectHeight / 2 - 10
    );
  }

  function drawUpperCornerText(text) {
    context.fillStyle = "#333";
    context.shadowBlur = 0;
    context.font = "28px Verdana";
    context.textBaseline = "middle";
    context.textAlign = "left";
    context.fillText(text, 20, 30);
  }

  function drawBigText(text) {
    clearScreen();

    context.fillStyle = "#333";
    context.shadowBlur = 0;
    context.font = "60px Verdana";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillText(text, canvas.width / 2, canvas.height / 2);
  }

  function render(screenData) {
    if (!screenData) {
      return;
    }

    const screenRenders = {
      bigTextScreen: () => {
        drawBigText(screenData.text);
        drawButton(screenData.buttonText, screenData.buttonAction);
      },
      boardScreen: () => {
        drawGameBoard(screenData);
        drawButton(screenData.buttonText, screenData.buttonAction);
        drawUpperCornerText(`Level: ${screenData.level}`);
      }
    };

    const renderFunction = screenRenders[screenData.screen];

    if (renderFunction) {
      console.log(`Render screen: ${screenData.screen}`);
      state.currentScreenData = screenData;
      renderFunction(screenData);
    }
  }

  function eventHandler(command) {
    const acceptedCommands = {
      render
    };

    const commandFunction = acceptedCommands[command.type];

    if (commandFunction) {
      console.log(`Presentation received: ${command.type}`);
      commandFunction(command.data);
      notifyAll({
        type: "buttonsUpdated",
        data: {
          buttons: state.buttons
        }
      });
    }
  }


  window.onresize = evt =>
    recalculateSize(document.body.clientWidth, document.body.clientHeight);

  return {
    eventHandler,
    recalculateSize,
    subscribe,
    unsubscribeAll
  };
}
