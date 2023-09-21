import * as h from '../helpers';
import * as ic from '../intcode';

var program = h.read(5, "program.txt",)[0].split(',').tonum();

var index = {i:0};
var output = ic.run(program, 1);
h.print("-- end of part 1 --");