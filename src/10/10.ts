import * as h from '../helpers';

var getLocations = (map: string[][]) : [number, number][] => {
    var locations: [number, number][] = [];
    map.map((row, y) => row.map((cell, x) => {
        if (cell == '#') locations.push([x,y]);
    }));
    return locations;
}
var getDirection = (location1:[number,number], location2:[number,number]) : [number, number] => {
    var [x1,y1] = location1;
    var [x2,y2] = location2;
    var [dx,dy] = [x2-x1, y2-y1];
    var divisor = h.getCommonFactors(Math.abs(dx), Math.abs(dy)).prod();
    return [dx/divisor, dy/divisor];
}

var getIntermediateLocations = (location1:[number,number], location2:[number,number]) : [number, number][] => {
    var direction = getDirection(location1, location2);
    var intermediateLocations: [number, number][] = [];
    var currentLocation = location1.map((x, i) => x + direction[i]);
    while (!h.equals2(currentLocation, location2)){
        intermediateLocations.push(currentLocation as [number, number]);
        currentLocation = currentLocation.map((x, i) => x + direction[i]);
    }
    return intermediateLocations;
}

var asteroids = h.read(10, "asteroids.txt", "ex").map(x => x.split(''));
h.print(asteroids);
h.print(getLocations(asteroids));

var factors = h.factorize(25);
h.print(factors);