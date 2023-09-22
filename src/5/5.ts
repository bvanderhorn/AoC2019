import * as h from '../helpers';
import * as ic from '../intcode';

var program = h.read(5, "program.txt",)[0].split(',').tonum();
h.print("part 1:", ic.run(program.copy(), [1]).string(' - '));
h.print("part 2:", ic.run(program.copy(), [5]).string());