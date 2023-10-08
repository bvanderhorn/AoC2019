import * as h from '../helpers';

var equations = h.read(14, "equations.txt").split(/=>|,/).trim().map(x => x.reverse());
h.print(equations.slice(0,3));

