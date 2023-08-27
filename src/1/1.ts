import * as h from '../helpers';

var toFuel1 = (mass: number): number => Math.floor(mass / 3) - 2;
var toFuel2 = (mass: number): number => {
    var fuel = toFuel1(mass);
    return fuel <= 0 ? 0 : fuel + toFuel2(fuel);
}

var modules = h.read(1, "modules.txt");
h.print("part 1:", modules.map(toFuel1).sum());
h.print("part 2:", modules.map(toFuel2).sum());