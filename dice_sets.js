var args = process.argv.slice(2);
var dice = args[0];
var rolls = args[1];
var sets = args[2]
var minimum = 0;
var example = "Ex: node ./dice_sets.js 8 5 6 (Displays 6 sets of d8s rolled 5 times)"

function isTrueNum(id) {
    return typeof(id) === 'number' && 
    		isFinite(id) &&  
    		Math.round(id) === id;
}

function getRndInt(max){
	return Math.floor(Math.random()* max) + 1;
}

function getRndRolls(rMax, rCnt){
	var rollSet = [];
	for (var i = 0; i < rCnt; i++){
		rollSet.push(getRndInt(rMax));
	}
	return rollSet;
}

function getRollSets(numDice, numRoll, numSet){
	var obj = {};
	var tmpRollSet;
	for (var i = 1; i <= numSet; i++){
		obj["set-"+i] = [];
		tmpRollSet = getRndRolls(numDice, numRoll);
		tmpRollSet.forEach(function(diceRolled){
			obj["set-"+i].push(diceRolled);
		});		
	}
	return obj;
}

if (args.length != 3) {	
	console.log("I need three values \n"+example);
	process.exit(0);
}

args.forEach(function(arg){
	if (!isTrueNum(parseInt(arg))) {	
		console.log("Not a valid roll value \n"+example);
		process.exit(0);
	}
});

console.log(getRollSets(dice, rolls, sets));