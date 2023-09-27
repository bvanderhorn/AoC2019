import * as h from '../helpers';

var asteroids = h.read(10, "asteroids.txt").map(x => x.split(''));
h.print(asteroids.slice(0,2));