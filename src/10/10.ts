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
    return il.filter(l => locations.some(l2 => h.equals2(l, l2))).length == 0;
}
var getVisibles = (location:[number,number], locations: [number,number][]) : [number,number][] => 
    locations.filter(l => isVisible(location, l, locations)).filter(l => !h.equals2(l, location));

var getAngle = (location:[number,number]) : number => {
    var [x,y] = location;
    var angle = Math.atan2(x, -y) * 180 / Math.PI;
    return angle < 0 ? angle + 360 : angle;
}
var sortOnAngle = (location: [number, number], locations: [number,number][]) : [number,number][] => {
    return locations.sort((a,b) => getAngle(diff(location, a)) - getAngle(diff(location, b)));
}
var diff = (location1:[number,number], location2:[number,number]) : [number,number] => [location2[0] - location1[0], location2[1] - location1[1]];
var getLaseredOnIndex = (location:[number,number], locations: [number,number][], index:number) : [number,number] => {
    var curIndex = 0;
    while (true){
        var visibles = sortOnAngle(location, getVisibles(location, locations));
        if (visibles.length + curIndex < index) {
            locations = locations.filter(x => !visibles.some(y => h.equals2(x,y)));
            curIndex += visibles.length;
            continue;
        }
        return visibles[index - 1 - curIndex];
    }
}

var asteroids = h.read(10, "asteroids.txt").map(x => x.split(''));

// part 1
var locations = getLocations(asteroids);
var visible = locations.map(l => getVisibles(l, locations).length);
var maxIndex = visible.indexOf(visible.max());
var station = locations[maxIndex];
h.print("part 1:", visible[maxIndex], "asteroids visible from location", station);

// part 2
var v = sortOnAngle(station, getVisibles(station, locations));
h.print(v.slice(0,5));
var laseredOnIndex = getLaseredOnIndex(station, locations.copy(), 200);
h.print("part 2:", laseredOnIndex, "=>", laseredOnIndex[0]*100 + laseredOnIndex[1]);