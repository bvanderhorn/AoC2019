import * as h from '../helpers';
import * as ic from '../intcode';

var program = h.read(9, "program.txt")[0].split(',').tonum();

var state = new ic.State(program.copy(), [1]);
var output = state.run();
h.print("part 1:", output.join(", "));