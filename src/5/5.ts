import * as h from '../helpers';
import * as ic from '../intcode';

var program = h.read(5, "program.txt",)[0].split(',').tonum();

h.print("-- part 1 --")
var index = {i:0};
ic.run(program.copy(), [1]).print(' - ');

h.print("-- part 2 --")
index.i = 0;
ic.run(program.copy(), [5]).print();