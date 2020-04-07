export default function createMenu(game) {
  let sprite = null;

  function preload(scene) {
    scene.load.path = "assets/images/";
    scene.load.image("game-title", "Menu/title_titletext.png");
    scene.load.image("one-player-normal", "Menu/One_Player_Normal.png");
    scene.load.image("one-player-hover", "Menu/One_Player_Hover.png");
    scene.load.image("two-players-normal", "Menu/Two_Players_Normal.png");
    scene.load.image("two-players-hover", "Menu/Two_Players.png");
    scene.load.image("title-background", "Menu/title_background.jpg");
  }

  function createSprites(scene) {
    const { width, height } = scene.cameras.main;

    let bg = scene.add.image(width / 2, height / 2, "title-background");
    let scale = Math.max(width / bg.width, height / bg.height);
    bg.setScale(scale).setScrollFactor(0);
    let titleText = scene.add.image(width / 2, height / 2, "game-title");
    titleText.setScale(scale).setScrollFactor(0);

    let onePlayerButton = scene.add
      .sprite(width / 2, height * 0.7, "one-player-normal")
      .setScale(scale * 1.5)
      .setInteractive();

    onePlayerButton.on("pointerover", (pointer) => {
      onePlayerButton.setTexture("one-player-hover");
    });

    onePlayerButton.on("pointerout", (pointer) => {
      onePlayerButton.setTexture("one-player-normal");
    });

    let closeMenu = () => {
      console.log("PLAY");
      bg.visible = false;
      titleText.visible = false;
      onePlayerButton.visible = false;
      onePlayerButton.active = false;
    };

    return { onePlayerButton, closeMenu };
  }

  return {
    preload,
    createSprites,
    sprite,
  };
}
