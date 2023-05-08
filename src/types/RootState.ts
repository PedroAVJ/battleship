import User from './User';
import ShipName from './ShipName';
import Orientation from './Orientation';


export default interface RootState {

    player: User;
    computer: User;

    currentlyDraggedShip?: {
        name: ShipName;
        orientation: Orientation;
    }

}