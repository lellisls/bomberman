export default function createClickListener(canvas) {
  let state = {
    observers: [],
    buttons: new Map()
  };

  const context = canvas.getContext("2d");

  function subscribe(observerFunction) {
    state.observers.push(observerFunction);
  }

  function unsubscribeAll() {
    state.observers = [];
  }

  function notifyAll(command) {
    console.log("ClickListener: ", command);
    for (const observerFunction of state.observers) {
      observerFunction(command);
    }
  }

  function regionClicked(clickX, clickY) {
    for (let [region, button] of state.buttons.entries()) {
      if (context.isPointInPath(button, clickX, clickY)) {
        const command = {
          type: "regionClicked",
          data: { region }
        };
        notifyAll(command);
        break;
      }
    }
  }

  function regionReleased() {
    const command = {
      type: "regionReleased",
      data: {}
    };

    notifyAll(command);
  }

  function eventHandler(command) {
    const acceptedCommands = {
      buttonsUpdated: ({ buttons }) => {
        state.buttons = buttons;
      }
    };

    const commandFunction = acceptedCommands[command.type];

    if (commandFunction) {
      console.log(`ClickListener received: ${command.type}`);
      commandFunction(command.data);
    }
  }

  canvas.addEventListener(
    "mousedown",
    evt => regionClicked(evt.clientX, evt.clientY),
    false
  );

  canvas.addEventListener(
    "touchstart",
    evt =>
      evt.touches.length
        ? regionClicked(evt.touches[0].clientX, evt.touches[0].clientY)
        : null,
    false
  );

  canvas.addEventListener("mouseup", evt => regionReleased(), false);

  canvas.addEventListener("touchend", evt => regionReleased(), false);

  return {
    subscribe,
    unsubscribeAll,
    eventHandler
  };
}
