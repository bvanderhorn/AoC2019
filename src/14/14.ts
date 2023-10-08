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

var getNotInOtherIntermediates = (minerals: string[], equations: string[][]) : string[] => {
    var intermediates = minerals.map(m => getIntermediates(m, equations));
    return minerals.filter((m,i) => !intermediates.some((x,j) => i != j && x.includes(m)));
}

var equations = h.read(14, "equations.txt", "ex").split(/=>|,/).trim().map(x => x.reverse());
// h.print(equations.slice(0,3));

console.time("part 1");
var fuelEq = getEquation("FUEL", equations);
var totalEquation = new Map<string, number>();
fuelEq.slice(1).forEach(x => totalEquation.set(dissect(x).mineral, dissect(x).amount));

// h.print(totalEquation);
while(totalEquation.size >1) {
    var next = getNotInOtherIntermediates(Array.from(totalEquation.keys()), equations);
    for (const n of next){
        var eq = getEquation(n, equations);
        var amount = dissect(eq[0]).amount;
        var needed = totalEquation.get(n);
        var times = Math.ceil((needed ?? 0) / amount);
        for (const e of eq.slice(1).map(x => dissect(x))) {
            totalEquation.set(e.mineral, (totalEquation.get(e.mineral) ?? 0) + e.amount * times);
        }
        totalEquation.delete(n);
    }    
}
console.timeEnd("part 1");
h.print("part 1:",totalEquation.get("ORE"));