import * as h from '../helpers';

var toFuel = (mass: number, part: number): number => {
    var fuel = Math.floor(mass / 3) - 2;
    return fuel <= 0 ? 0 : fuel + (part == 1 ? 0 : toFuel(fuel, part));
}

var modules = h.read(1, "modules.txt");
h.print("part 1:", modules.map(x => toFuel(x, 1)).sum());
h.print("part 2:", modules.map(x => toFuel(x, 2)).sum());