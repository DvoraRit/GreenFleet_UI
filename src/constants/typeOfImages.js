import miniBuss from '../assets/icons/activeMiniBus.svg';
import bus from '../assets/icons/activeBussIcon copy.svg';
import station from '../assets/icons/station.png';
import taxiIcon from '../assets/iconsTaxiIcon.png';
import taxiIconSmall from '../assets/icons/TaxiIconSmall.png';
import intrestPoint from '../assets/icons/locationPoints.svg';

export const VehicleImges = {

    [Vehicle.smBussActive]: miniBuss,
    [Vehicle.mdBusActive]: bus,
    [Vehicle.smCarActive]: taxiIcon,
    [Vehicle.smBuss]: miniBuss,
    [Vehicle.bus]: bus,
    [Vehicle.smallTaxi]: taxiIconSmall,
}
export const StationImges = {
    [station]: station,
    [intrestPoint]: intrestPoint,
}