import * as h from '../helpers';

var toFuel = (mass: number): number => Math.floor(mass / 3) - 2;

var modules = h.read(1, "modules.txt");
h.print("part 1:", modules.map(toFuel).sum());