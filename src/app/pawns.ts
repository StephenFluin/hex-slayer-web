import { Player } from './player';

export class Pawn {
    upkeep = 0;
    image: string;
    canMove = false;
    player: Player;
}
/**
 * I'm not sure if villages should be pawns. You can have a village OR a pawn, not both.
 * A lot of code looks to the "village" of a tile so I think having it spearate saves me
 * a lot of 'if pawn istanceof villager'
 */
export class Village {
    // 5 for real play, 10 for debugging
    balance = 10;
    upkeep = 0;
    image = './assets/village.png';
}

export class Castle extends Pawn {
    image = './assets/castle.png';
}

export class Villager extends Pawn {
    upkeep = 2;
    level = 1;
    upkeeps = [2, 6, 18, 50];
    images = ['villager', 'wizard', 'swordsman', 'knight'].map(name => `./assets/${name}.png`);
    image = this.images[0];
    canMove = true;

    levelUp() {
        this.level++;
        this.upkeep = this.upkeeps[this.level - 1];
        this.image = this.images[this.level - 1];
    }
}

export class Grave extends Pawn {}
