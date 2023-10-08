import { get } from 'http';
import * as h from '../helpers';

var dissect = (equation: string) : {amount: number, mineral: string} => {
    var [amount, mineral] = equation.trim().split(' ');
    return {amount: +amount, mineral};
}
var getEquation = (mineral: string, equations: string[][]) : string[] => equations.filter(x => dissect(x[0]).mineral == mineral)[0];

var getIntermediates = (fromMineral:string, equations: string[][], toMineral: string) : string[] => {
    var fromEq = getEquation(fromMineral, equations).map(x => dissect(x).mineral);
    var next = fromEq.slice(1).filter(x => x != toMineral);
    var tree = [...next];
    for (const n of next) tree.push(...getIntermediates(n, equations, toMineral));
    return tree.unique();
}

var getNotInOtherIntermediates = (minerals: string[], equations: string[][], toMineral: string) : string[] => {
    var intermediates = minerals.map(m => getIntermediates(m, equations, toMineral));
    return minerals.filter((m,i) => !intermediates.some((x,j) => i != j && x.includes(m)));
}

var equate = (equation: Map<string, number>, toMineral: string, equations: string[][], equateOrder: string[] = []) : {needed: number, equateOrder: string[]} => {
    // if equate order is known, use to speed up the process
    var totalEquation = new Map(equation);
    var equateOrderOut: string[] = [];
    while(totalEquation.size >1) {
        var next = equateOrder.length == 0 
            ? getNotInOtherIntermediates(Array.from(totalEquation.keys()).filter(x => x!= toMineral), equations, toMineral)
            : equateOrder;
        for (const n of next){
            var eq = getEquation(n, equations);
            var amount = dissect(eq[0]).amount;
            var needed = totalEquation.get(n);
            var times = Math.ceil((needed ?? 0) / amount);
            for (const e of eq.slice(1).map(x => dissect(x))) {
                totalEquation.set(e.mineral, (totalEquation.get(e.mineral) ?? 0) + e.amount * times);
            }
            totalEquation.delete(n);
            equateOrderOut.push(n);
        }    
    }
    return {
        needed: totalEquation.get(toMineral) ?? 1E15,
        equateOrder: equateOrderOut
    };
}

var equationTimes = (amount: number, equation: Map<string, number> ) : Map<string, number> => 
    new Map(Array.from(equation, ([k,v]) => [k, v * amount] as [string, number]));

var equateTimes = (amount: number, equation: Map<string, number>, toMineral: string, equations: string[][], equateOrder: string[]) : number => {
    var totalEquation = equationTimes(amount, equation);
    return equate(totalEquation, toMineral, equations, equateOrder).needed;
}

var newtonSearch = (amount: number, singleNeeded: number, equation: Map<string, number>, toMineral: string, equations: string[][], equateOrder: string[]) : number => {
    var times = Math.floor(amount / singleNeeded);
    var deltaTimes = times;
    
    // initial search
    while(deltaTimes > 1) {
        var needed = equateTimes(times, equation, toMineral, equations, equateOrder);
        if (needed > amount) {
            times -= deltaTimes;
            deltaTimes = Math.ceil(deltaTimes / 2);
        } else {
            times += deltaTimes;
        }
    }

    // refined search
    var curNeeded = equateTimes(times, equation, toMineral, equations, equateOrder);
    if (curNeeded == amount) return times;
    else if (curNeeded > amount) {
        while (curNeeded > amount) {
            times--;
            curNeeded = equateTimes(times, equation, toMineral, equations, equateOrder);
        }
        return times;
    }
    else {
        while (curNeeded < amount) {
            times++;
            curNeeded = equateTimes(times, equation, toMineral, equations, equateOrder);
        }
        return curNeeded == amount ? times : times - 1;
    }
}

var equations = h.read(14, "equations.txt").split(/=>|,/).trim().map(x => x.reverse());

var fromMineral = "FUEL";
var toMineral = "ORE";

// get main equation
var fuelEq = getEquation(fromMineral, equations);
var totalEquation = new Map<string, number>();
fuelEq.slice(1).forEach(x => totalEquation.set(dissect(x).mineral, dissect(x).amount));

// part 1
var p1 = equate(totalEquation, toMineral, equations);
h.print("part 1:",p1.needed);

// part 2
var ore = 1E12;
var times = newtonSearch(ore, p1.needed, totalEquation, toMineral, equations, p1.equateOrder);
h.print("part 2:", times);