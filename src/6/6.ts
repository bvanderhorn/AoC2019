import * as h from '../helpers';

var orbits = h.read(6, "orbits.txt").split(')');

var orbitMap = new Map<string,string[]>();
for (const orbit of orbits){
    var [a,b] = orbit;
    if (!orbitMap.has(a)) orbitMap.set(a,[b]);
    else orbitMap.get(a)!.push(b);
}

var subjectsLeft = orbits.map( x=> x[1]);
var current = ["COM"];
var next: string[] = [];
var totalOrbits = 0;
var orbitMultiplier = 1;
while(subjectsLeft.length > 0){
    for (const subject of current){
        var upcoming = orbitMap.get(subject) ?? [];
        totalOrbits += orbitMultiplier*upcoming.length;
        next = next.concat(upcoming);
    }
    subjectsLeft = subjectsLeft.filter(x => !current.includes(x));
    current = next;
    next = [];
    orbitMultiplier++;
}

h.print("part 1:", totalOrbits);