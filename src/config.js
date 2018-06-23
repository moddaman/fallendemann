export default {
  type: Phaser.AUTO,
  gameWidth: 1000,
  gameHeight: 1000,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
  },
  localStorageName: 'phaseres6webpack',
  webfonts: ['Bangers']
}
