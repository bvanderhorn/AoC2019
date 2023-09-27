import * as h from '../helpers';
import * as ic from '../intcode';

var program = h.read(9, "program.txt","ex")[0].split(',').tonum();

var state = new ic.State(program.copy());
var output = state.run();
h.print("part 1:", output.string());