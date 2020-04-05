import boardGenerator from "./utils/boardGenerator";
import Phaser from "phaser";
import createPlayer from "./elements/player";
import createScenario from "./elements/scenario";
import createCreep from "./elements/creep";
import createBomb from "./elements/bomb";
import createCollisionFinder from "./utils/collisionFinder";

const BOARD_WIDTH = 11;
const BOARD_HEIGHT = 11;

const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: BOARD_WIDTH * 64,
  height: BOARD_HEIGHT * 64,
  backgroundColor: "#4d4d4d",
  pixelArt: true,
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
};

const game = new Phaser.Game(config);

const player = createPlayer(game);
const scenario = createScenario(game);
const creepManager = createCreep(game);
const bombManager = createBomb(game);
const collisionFinder = createCollisionFinder(game);

const state = {
  level: 1,
  board: {},
  sprites: {
    player: null,
    creeps: [],
    portal: null,
  },
  bombGroup: null,
  creepGroup: null,
  explodableBlocksGroup: null,
  scenario: {},
};

game.state = state;
game.collisionFinder = collisionFinder;

let cursors;

function preload() {
  player.preload(this);
  scenario.preload(this);
  creepManager.preload(this);
  bombManager.preload(this);
}

function create() {
  state.board = boardGenerator(state.level, BOARD_WIDTH, BOARD_HEIGHT);

  state.scenario = scenario.createSprites(this, state.board);
  const { solidBlocksLayer, explodableBlocksGroup, portal } = state.scenario;

  state.sprites.portal = portal;
  state.sprites.player = player.createSprite(this);
  state.sprites.creeps = [];

  state.creepGroup = creepManager.createGroup(this);
  const { bombGroup, flameGroup } = bombManager.createGroups(this);

  state.explodableBlocksGroup = explodableBlocksGroup;
  state.bombGroup = bombGroup;
  state.flameGroup = flameGroup;

  for (let y = 0; y < state.board.height; ++y) {
    for (let x = 0; x < state.board.width; ++x) {
      if ("creep" === state.board.data[y][x]) {
        const index = state.sprites.creeps.length;
        let creep = creepManager.createCreep(x, y, index);
        state.sprites.creeps.push(creep);
      }
    }
  }

  this.physics.add.collider(state.sprites.player, solidBlocksLayer);
  this.physics.add.collider(state.sprites.player, explodableBlocksGroup);

  this.physics.add.collider(
    state.creepGroup,
    solidBlocksLayer,
    creepManager.changeDirection
  );
  this.physics.add.collider(
    state.creepGroup,
    explodableBlocksGroup,
    creepManager.changeDirection
  );
  this.physics.add.collider(
    state.creepGroup,
    state.bombGroup,
    creepManager.changeDirection
  );
  this.physics.add.collider(
    state.creepGroup,
    portal,
    creepManager.changeDirection
  );
  this.physics.add.collider(
    state.creepGroup,
    state.creepGroup,
    creepManager.changeDirection
  );

  this.physics.add.collider(
    state.creepGroup,
    state.sprites.player,
    creepManager.changeDirection
  );

  cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(state.bombGroup, state.sprites.player);
  this.input.keyboard.on("keydown-SPACE", placeBomb);
}

function placeBomb() {
  const { bx, by } = player.getBombPosition();
  const [scene] = game.scene.scenes;
  const bombCollisions = game.collisionFinder.findCollisions(bx, by, 20);

  if (bombCollisions.length > 0) {
    return;
  }

  const bomb = bombManager.createBomb(bx, by);
}

function update(time, delta) {
  if (cursors.up.isDown) {
    player.moveUp();
  } else if (cursors.down.isDown) {
    player.moveDown();
  } else if (cursors.left.isDown) {
    player.moveLeft();
  } else if (cursors.right.isDown) {
    player.moveRight();
  } else {
    player.idle();
  }

  // state.sprites.creeps.forEach((creep) => {
  //   creepManager.moveRight(creep);
  // });
}
