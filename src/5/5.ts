import * as h from '../helpers';
import * as ic from '../intcode';

var program = h.read(5, "program.txt",)[0].split(',').tonum();
h.print("part 1:", new ic.State(program.copy(), [1]).run().string(' - '));
h.print("part 2:", new ic.State(program.copy(), [5]).run().string());