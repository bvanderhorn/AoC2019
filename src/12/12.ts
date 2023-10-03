import * as h from '../helpers';

var moons = h.read(12, "moons.txt").match("<x=(.*), y=(.*), z=(.*)>", true).tonum();
h.print(moons);