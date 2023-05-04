import User from './User';
import Ship from './Ship';


/**
 * @property `gui` - Keeps track of the ships left to place in case the page is refreshed
 * @property `shipPreview` - Keeps track of what ship should be rendered while hoovering over the board. This is because drag enter and drag leave events don't have access to the dataTransfer object.
 * @method `allShipsPlaced` - Once all gui ships are placed, this method returns true
 */
export default class RootState {

    gui: {
        submarineCount: number;
        supplyBoatCount: number;
        destroyerCount: number;
        battleshipCount: number;
        frigateCount: number;
        aircraftCarrierCount: number;
    };
    
    player: User;
    computer: User;

    shipPreview?: Ship;

    constructor() {
        this.gui = {
            submarineCount: 0,
            supplyBoatCount: 0,
            destroyerCount: 0,
            battleshipCount: 0,
            frigateCount: 0,
            aircraftCarrierCount: 0,
        };
        this.player = new User();
        this.computer = new User();
    }

    allShipsPlaced(): boolean {
        const totalShipCount = Object.values(this.gui).reduce((acc, curr) => acc + curr, 0);
        return totalShipCount === 0;
    }

}