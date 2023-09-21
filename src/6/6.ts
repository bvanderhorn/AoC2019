import * as h from '../helpers';

var getOrbits = (subject:string) : number => {
    var orbits = 0;
    while (orbitMap.has(subject)){
        subject = orbitMap.get(subject)!;
        orbits++;
    }
    return orbits;
}

var orbits = h.read(6, "orbits.txt").split(')');
var orbitMap = new Map<string,string>();
orbits.map(x => orbitMap.set(x[1],x[0]));
var subjects = orbits.map( x=> x[1]);
h.print("part 1:", subjects.map(getOrbits).sum());