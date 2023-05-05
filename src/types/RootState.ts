import User from './User';
import ShipName from './ShipName';
import Orientation from './Orientation';


/**
 * @property `gui` - Keeps track of the ships left to place in case the page is refreshed
 * @property `currentlyDraggedShip` - Keeps track of the ship currently being dragged, for displaying a preview and for dropping into the board
 * @method `allShipsPlaced` - Once all gui ships are placed, this method returns true
 */
export default class RootState {
    
    player: User;
    computer: User;

    currentlyDraggedShip?: {
        name: ShipName;
        orientation: Orientation;
    }

    constructor() {
        this.player = new User();
        this.computer = new User();
    }

    allPlayerShipsPlaced(): boolean {
        Object.entries(ShipName).forEach(([key, value]) => {
            if (this.player[value].guiCount > 0) return false;
        });
        return true;
    }

}