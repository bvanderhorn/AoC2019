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

var move = (moons: Moon[], steps: number = 1, verbose:boolean = false) : void => {
    for (var i = 0; i < steps; i++) {
        for (const m1 of moons) {
            for (const m2 of moons) {
                if (m1 == m2) continue;
                m1.applyGravity(m2);
            }
        }
        for (const m of moons) {
            m.applyVelocity();
        }
        if (verbose) h.print("step",i+1, ":\n",moons.map(m => m.summary()))
    }
    
}
var moons = h.read(12, "moons.txt").match("<x=(.*), y=(.*), z=(.*)>", true).tonum().map(x => new Moon(x, [0,0,0]));

move(moons, 1000);
h.print("part 1:", moons.map(m => m.getEnergy()).sum());

