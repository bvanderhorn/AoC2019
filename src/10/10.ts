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
    if (dx == 0) return dy == 0 ? [0,0] : [0, dy/Math.abs(dy)];
    if (dy == 0) return [dx/Math.abs(dx), 0];
    var commonFactors = h.getCommonFactors(Math.abs(dx), Math.abs(dy));
    var divisor = commonFactors.length == 0 ? 1 : commonFactors.prod();
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

var isVisible = (l1:[number,number], l2:[number,number], locations: [number,number][]) : boolean => {
    var il = getIntermediateLocations(l1, l2);
    return il.length == 0 
        ? true
        : il.filter(l => locations.some(l2 => h.equals2(l, l2))).length == 0;
}

var asteroids = h.read(10, "asteroids.txt").map(x => x.split(''));
var locations = getLocations(asteroids);
h.print(locations);
var visible = locations.map(l => locations.filter(l2 => isVisible(l, l2, locations)).length ).plus(-1);
h.print("part 1:", visible.max());