export default function createKeyListener(document) {
  const state = {
    observers: [],
  };

  function subscribe(observerFunction) {
    state.observers.push(observerFunction);
  }

  function unsubscribeAll(observerFunction) {
    state.observers = [];
  }

  function notifyAll(command) {
    console.log("KeyListener: ", command);
    for (const observerFunction of state.observers) {
      observerFunction(command);
    }
  }

  document.addEventListener("keydown", handleKeydown);

  function handleKeydown(event) {
    const keyPressed = event.key;

    const command = {
      type: "movePlayer",
      data: {
        keyPressed,
      },
    };

    notifyAll(command);
  }

  return {
    subscribe,
    unsubscribeAll,
  };
}
