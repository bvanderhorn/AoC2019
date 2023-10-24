import * as h from '../helpers';
import * as ic from '../intcode';

const show2 = (output:number[]) : string => output.map(x => String.fromCharCode(x)).join('');

const program = h.read(17, "program.txt")[0].split(',').tonum();
var state = new ic.State(program.copy());
var output = state.runTillInputNeededOrHalt();
h.write(17,"output.txt",output.join(','));

h.print(output.length);
show2(output).printc(x => '^>v<X'.includes(x));