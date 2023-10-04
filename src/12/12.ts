import * as h from '../helpers';
type Vector = [number, number, number];
class Moon {
    public position: Vector;
    public velocity: Vector;

    constructor(position: Vector, velocity: Vector) {
        [this.position, this.velocity] = [position, velocity];
    }

    public getGravity = (others: Moon[]) : Vector => 
        this.position.map( (x,i) => {
            var ipos = others.map(y => y.position[i]);
            return ipos.filter(y => y > x).length - ipos.filter(y => y < x).length;
        }) as Vector;

    public applyGravity = (others: Moon[]) : void => {
        this.velocity = this.velocity.plusEach(this.getGravity(others)) as Vector;
    }
    public applyVelocity = () : void => {
        this.position = this.position.plusEach(this.velocity) as Vector;
    }

    public getEnergy = () : number => this.position.abs().sum() * this.velocity.abs().sum();

    public summary = () : {position: Vector, velocity: Vector} => ({position: this.position, velocity: this.velocity});
}
var getState = (moons: Moon[]) : number[] => moons.map(m => [m.position, m.velocity]).flat(2);
var move = (moons: Moon[], steps: number = 1, verbose:boolean = false) : void => {
    // var states = new Set<string>();
    // states.add(getState(moons));
    var state0 = getState(moons);
    var stepsize = 1E6;
    for (var i = 1; i <= steps; i++) {
        if (i%stepsize == 0) h.print("step", i/stepsize, "*1E6"); 
        moons.forEach(m => m.applyGravity(moons));
        moons.forEach(m => m.applyVelocity());
        // if (verbose) h.print("step",i, ":\n",moons.map(m => m.summary()))
        // var state = getState(moons);
        if (h.equals2(getState(moons), state0)) {
            h.print("found a state that has already been seen after", i, "steps");
            return;
        }
        //states.add(state);
    }
    
}
var moons = h.read(12, "moons.txt").match("<x=(.*), y=(.*), z=(.*)>").tonum().map(x => new Moon(x, [0,0,0]));

var moons1 = moons.slice(0);
move(moons1, 100);
h.print("part 1:", moons1.map(m => m.getEnergy()).sum());

h.print("factors of ", 4686774924, ":", h.factorize(4686774924));

// part 2
var moons2 = moons.slice(0);
console.time("move");
move(moons2, 1000000);
console.timeEnd("move");

