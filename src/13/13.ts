import * as h from '../helpers';
import * as ic from '../intcode';

class TileState {

   public tiles: number[][];
   private _score: number = 0;
   
   constructor(tiles:number[][]) {
	   this.tiles = tiles;
	   this.setScore();
   }

   public get score() : number {
	   return this._score;
   }

   private  setScore = () : void => {
       var scoreIndex = this.tiles.findIndex(x => x[0] == -1 && x[1] == 0);
       if (scoreIndex > -1) {
           this._score = this.tiles[scoreIndex][2];
           this.tiles.splice(scoreIndex, 1);
       }
   }

   private getTile = (type:number) : string => {
       switch (type) {
           case 0: return " ";
           case 1: return "#";
           case 2: return "X";
           case 3: return "-";
           case 4: return "o";
           default: throw new Error("invalid tile type");
       }
   }

   public draw = () : void => {
	h.print("score:", this._score);

       var xRange = this.tiles.map(x => x[0]).minmax();
       var yRange = this.tiles.map(x => x[1]).minmax();
       var str: string[][] = [];
       for (var y = yRange[0]; y <= yRange[1]; y++) {
           var curStr : string[] = [];
           for (var x = xRange[0]; x <= xRange[1]; x++) {
               var mIndex = this.tiles.findIndex(m => h.equals2(m.slice(0,2), [x,y]));
               curStr.push(mIndex>-1 ? this.getTile(this.tiles[mIndex][2]) : ".");
           }
           str.push(curStr);
       }
    
       str.printc(x => x == "o", 'c');
   }

   public update = (newTiles: number[][] ) : void => {
       for (const t of newTiles) {
	   var tindex = this.tiles.findIndex(x => h.equals2(x.slice(0,2), t.slice(0,2)));
	   if (tindex>-1) this.tiles.splice(tindex, 1,t);
	   else this.tiles.push(t);
       }
	this.setScore();
   }
}
var program = h.read(13, "program.txt")[0].split(',').tonum();
var state = new ic.State(program.copy(), []);
var tiles = state.runTillInputNeededOrHalt().chunks(3);
h.print("part 1:",tiles.map(x => x.last()).count(2));

// part 2
var program2 = program.copy();
program2[0] = 2;
var state2 = new ic.State(program2, []);

var tiles2 = state2.runTillInputNeededOrHalt().chunks(3);
var tState = new TileState(tiles2);
tState.draw();
state2.print(false);

//state2.input.push(0);
//tiles2 = state2.runTillInputNeededOrHalt().chunks(3);
//draw(tiles2);

//state2.input.push(1);
//tiles2 = state2.runTillInputNeededOrHalt().chunks(3);
//draw(tiles2);
