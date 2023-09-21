import * as h from '../helpers';

var getOrbits = (subject:string) : number => {
    var orbits = 0;
    while (orbitMap.has(subject)){
        subject = orbitMap.get(subject)!;
        orbits++;
    }
    return orbits;
}

var getOrbitPath = (subject:string) : string[] => {
    var path = [];
    while (orbitMap.has(subject)){
        subject = orbitMap.get(subject)!;
        path.push(subject);
    }
    return path;
}
var commonAncestor = (a:string, b:string) : string => {
    var pathA = getOrbitPath(a);
    var pathB = getOrbitPath(b);
    var common = pathA.filter(x => pathB.includes(x));
    return common[0];
}
var orbitalDistance = (a:string, b:string) : number => {
    var ancestor = commonAncestor(a,b);
    return getOrbits(a) + getOrbits(b) - 2 * getOrbits(ancestor);
}

var orbits = h.read(6, "orbits.txt").split(')');
var orbitMap = new Map<string,string>();
orbits.map(x => orbitMap.set(x[1],x[0]));
var subjects = orbits.map( x=> x[1]);
h.print("part 1:", subjects.map(getOrbits).sum());
h.print("part 2:", orbitalDistance("YOU", "SAN"));