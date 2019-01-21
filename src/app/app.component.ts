import { Component } from '@angular/core';
import { Game } from './game';

import { gridWidth, gridHeight } from './config';
import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Villager, Castle, Village } from './pawns';
import { Tile } from './tile';

export interface PawnDroppable {
    type: 'villager' | 'castle';
    source: Village | Tile;
    realm: Tile[];
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    gridWidth = gridWidth;
    gridHeight = gridHeight;

    game = new Game();

    /**
     * Executes when a pawn was dropped successfully on a new tile
     */
    drag(x, y, msg, event: CdkDragDrop<PawnDroppable>) {
        console.log(x, y, msg, 'drag event succeeded', event);
        const dropped = <PawnDroppable>event.item.data;
        console.log(dropped, 'was dropped');
        if (dropped.type === 'villager') {
            if (dropped.source instanceof Village) {
                this.game.buyVillager(x, y, dropped.source);
            } else {
                this.game.moveVillager(x, y, dropped.source.x, dropped.source.y);
            }
        } else if (dropped.type === 'castle') {
            // Castles should only come from villages, because they can't be moved.
            this.game.buyCastle(x, y, (<Village>dropped.source));
        } else {
            console.error('unhandled drop type');
        }
    }
    canDrag(x, y) {
        return (event: CdkDrag) => {
            // console.log('can we drag this into', x, y, '?', event);
            const targetTile = this.game.tiles[y][x];
            const sourceTile = event.data.realm.tiles[0];
            if (
                targetTile.player === sourceTile.player &&
                !(targetTile.pawn instanceof Villager) &&
                !(targetTile.pawn instanceof Castle) &&
                !targetTile.village
            ) {
                return true;
            } else {
                return false;
            }
        };
    }
}
