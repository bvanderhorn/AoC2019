import * as h from '../helpers';

var dissect = (equation: string) : {amount: number, mineral: string} => {
    var [amount, mineral] = equation.trim().split(' ');
    return {amount: +amount, mineral};
}
var getEquation = (mineral: string, equations: string[][]) : string[] => equations.filter(x => dissect(x[0]).mineral == mineral)[0];

var getIntermediates = (fromMineral:string, equations: string[][], toMineral:string = "ORE") : string[] => {
    var fromEq = getEquation(fromMineral, equations).map(x => dissect(x).mineral);
    var next = fromEq.slice(1).filter(x => x != toMineral);
    var tree = [...next];
    for (const n of next) tree.push(...getIntermediates(n, equations));
    return tree.unique();
}

var equations = h.read(14, "equations.txt", "ex").split(/=>|,/).trim().map(x => x.reverse());
h.print(equations.slice(0,3));
h.print(getIntermediates("FUEL", equations));