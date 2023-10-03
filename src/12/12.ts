import * as h from '../helpers';
type Vector = [number, number, number];
class Moon {
    public position: Vector;
    public velocity: Vector;

    constructor(position: Vector, velocity: Vector) {
        [this.position, this.velocity] = [position, velocity];
    }

    public getGravity = (other: Moon) : Vector => 
        this.position.map( (x,i) => other.position[i] > x ? 1 : other.position[i] < x ? -1 : 0) as Vector;

    public applyGravity = (other: Moon) : void => {
        this.velocity = this.velocity.plusEach(this.getGravity(other)) as Vector;
    }
    public applyVelocity = () : void => {
        this.position = this.position.plusEach(this.velocity) as Vector;
    }

    public getEnergy = () : number => this.position.abs().sum() * this.velocity.abs().sum();

    public summary = () : {position: Vector, velocity: Vector} => ({position: this.position, velocity: this.velocity});
}
var getState = (moons: Moon[]) : string => moons.map(m => [m.position, m.velocity]).flat().join(',');
var move = (moons: Moon[], steps: number = 1, verbose:boolean = false) : void => {
    var states = new Set<string>();
    states.add(getState(moons));
    for (var i = 1; i <= steps; i++) {
        if (i%10000000 == 0) h.print("step", i/10000000, "*1E7"); 
        for (const m1 of moons) {
            for (const m2 of moons) {
                if (m1 == m2) continue;
                m1.applyGravity(m2);
            }
        }
        for (const m of moons) {
            m.applyVelocity();
        }
        // if (verbose) h.print("step",i, ":\n",moons.map(m => m.summary()))
        var state = getState(moons);
        if (states.has(state)) {
            h.print("found a state that has already been seen after", i, "steps");
            return;
        }
        states.add(state);
    }
    
}
var moons = h.read(12, "moons.txt").match("<x=(.*), y=(.*), z=(.*)>").tonum().map(x => new Moon(x, [0,0,0]));

var moons1 = moons.slice(0);
move(moons1, 100);
h.print("part 1:", moons1.map(m => m.getEnergy()).sum());

h.print("factors of ", 4686774924, ":", h.factorize(4686774924));

// part 2
var moons2 = moons.slice(0);
move(moons2, 100000000);

