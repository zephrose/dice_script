/* E7 Summoning Simulator
*  Proto-type
*  Author : Colt Carnes
*/

// Script Args
const args = process.argv.slice(2);
const numPulls = args[0];
const sumType = args[1];
const example = "Ex: node ./e7_sum_sim.js 10 cov (pulls 10 summons from the covenant pool)";

// Check if we have a valid execution
if (args.length != 2) {	
	console.log("I need two values \n"+example);
	process.exit(0);
}

if (!isTrueNum(parseInt(args[0]))) {	
	console.log("Not a valid numbder of rolls \n"+example);
	process.exit(0);
}

if (args[1] != "cov" && args[1] != "ml") {
	console.log("Not a valid summon type \n"+example);
	process.exit(0);
}

// Summoning Consts
const overallSumRoll = 10000;
const covRollType = 100;
const heroPull = 48;
const covenant = "cov";
const moonlight = "ml";

const summonInfo = {
	"Covenant":{
		"heroUp": 0,
		"hero5": 125,
		"hero4": 450,
		"hero3": 4100,
		"artUp": 0,
		"art5": 175,
		"art4": 650,
		"art3": 4000,
		"mHero5": 15,
		"mHero4": 50,
		"mHero3": 435,
	},
	"Moonlight":{
		"heroUp": 0,
		"hero5": 250,
		"hero4": 2750,
		"hero3": 7000,
		"artUp": 0,
		"art5": 0,
		"art4": 0,
		"art3": 0,
	}
}

/*
 * the base list of summonable characters and artifacts
 * USED FOR COVENANT AND RATE UP SUMMONS
 * need to update as new characters get added
*/
const basePool = {
	"hero3": ["Aither", "Butcher Corps Inquisitor", "Taranor Royal Guard", "Kluri", "Judith", "Alexa", "Roozid", "Tieria", "Enott", "Helga", "Azalea", "Taranor Guard", "Mucacha", "Hazel", "Montmorancy", "Adlay", "Carrot", "Jena", "Jecht", "Nemunas", "Rima", "Kiris", "Carmainerose", "Mistychain", "Pearlhorizon"],
	"hero4": ["Rose", "Silk", "Armin", "Zerato", "Karin", "Corvus", "Cartuja", "Cidd", "Achates", "Schuri", "Dingo", "Clarissa", "Leo", "Lots", "Maya", "Coli", "Purrgis", "Crozet", "Dominiel", "Romann", "Rin", "Angelica", "Surin"],
	"hero5": ["Vildred", "Charlotte", "Baal & Sezan", "Ravi", "Iseria", "Sez", "Tywin", "Ken", "Aramintha", "Chloe", "Basar", "Ludwig", "Sigret", "Destina", "Tenebria", "Krau", "Yufine", "Haste", "Cecilia", "Kayron", "Kise", "Bellona", "Violet", "Tamarinne", "Lidica", "Charles", "Cermia"],
	"heroUp": [],
	"art3": ["Grail of Blood", "Egg of Delusion", "Prophetic Candlestick", "Ancient Sheath", "Ranon's Memorandum", "Atma's Portal", "Alsacian Spear", "Labyrinth Cube", "Cursed Compass", "Sword of the Morning", "Mighty Yaksha", "Devil's Brand", "Goblin's Lamp", "Aqua Rose", "Ascending Axe", "Exorcist's Tonfa", "Daydream Joker", "Butterfly Mandolin", "Envoy's Pipe", "Timeless Anchor", "Forest Totem", "Oath Key"],
	"art4": ["El's Fist", "Hell Cutter", "Strak Gauntlet", "Aurius", "Adamant Shield", "Hilag Lance", "Moonlight Dreamblade", "Elyha's Knife", "Dust Devil", "Infinity Basket", "Sashe Ithanes", "Rosa Hargana", "Tagehel's Ancient Book", "Kal'adra", "Sira-Ren", "Water's Origin", "Wondrous Potion Vial", "Magaraha's Tome"],
	"art5": ["Sigurd Scythe", "Durandal", "Holy Sacrifice", "Elbris Ritual Sword", "Rhianna & Luciella", "Wind Rider", "Bloodstone", "Song of Stars", "Abyssal Crown", "Etica's Scepter", "Rod of Amaryllis", "Shimadra Staff", "Time Matter", "Uberius's Tooth", "Noble Oath", "Celestine", "Alexa's Basket", "Iron Fan", "Violet Talisman", "Idol's Cheer", "Sword of Judgment", "Justice For All", "Border Coin"],
	"artUp": []
}

/*
* USED FOR MOONLIGHT SUMMON
* may need to update this periodically?
* ehhh for now let's just say all light and dark characters on our list...
*/
const moonLightChars = {
	"hero3": ["Arowell", "Celeste", "Doris", "Elson", "Gloomyrain", "Gunther", "Mirsa", "Rikoris", "Church of Ilryos Axe", "Hurado", "Lorina", "Otillie", "Pyllis", "Requiemroar", "Sven", "Wanda"],
	"hero4": ["Assassin Cartuja", "Assassin Cidd", "Assassin Coli", "Auxiliary Lots", "Blood Blade Karin", "Celestial Mercedes", "Challenger Dominiel", "Kitty Clarissa", "Shadow Rose", "Shooting Star Achates", "Crimson Armin", "Fighter Maya", "General Purrgis", "Guider Aither", "Wanderer Silk", "Watcher Schuri", "Blaze Dingo","Crescent Moon Rin"],
	"hero5": ["Arbiter Vildred", "Dark Corvus", "Martial Artist Ken", "Specter Tenebria", "Judge Kise", "Maid Chloe", "Ruele of Light", "Specimen Sez", "Silver Blade Aramintha","Sage Baal & Sezan"],
}

let pulledSums = [];

function isTrueNum(id) {
    return typeof(id) === 'number' && 
    		isFinite(id) &&  
    		Math.round(id) === id;
}

function getRndInt(max){
	return Math.floor(Math.random()* max) + 1;
}

function getPulledSum(array) {
	return array[getRndInt(array.length)-1];
}

function getSummon(pullNum, pullType){	
	let summoned = []; 
	if (pullType === moonlight) {
		// do moonlight pull here
		if ( pullNum <= summonInfo.Moonlight.hero5 ) {
			summoned = moonLightChars.hero5;
		} else if ( pullNum <= summonInfo.Moonlight.hero4 ) {
			summoned = moonLightChars.hero4;
		} else {
			summoned = moonLightChars.hero3;
		}
		
	} else {
		// Check for Hero / Art
		if ( getRndInt(covRollType) <= heroPull ) {
			if ( pullNum <= summonInfo.Covenant.mHero5 ) {
				summoned =  moonLightChars.hero5;
			} else if ( pullNum <= summonInfo.Covenant.mHero4 ) {
				summoned =  moonLightChars.hero4;
			} else if ( pullNum <= summonInfo.Covenant.hero5 ) {
				summoned = basePool.hero5;
			} else if ( pullNum <= summonInfo.Covenant.mHero3 ) {
				summoned = moonLightChars.hero3;
			} else if ( pullNum <= summonInfo.Covenant.hero4 ) {
				summoned = basePool.hero4;
			} else {
				summoned = basePool.hero3;
			}
		} else {
			if ( pullNum <= summonInfo.Covenant.art5 ) {
				summoned = basePool.art5;
			} else if ( pullNum <= summonInfo.Covenant.art4 ) {
				summoned = basePool.art4;
			} else {
				summoned = basePool.art3;
			}
		}
	}

	// Pull our summon
	pulledSums.push(getPulledSum(summoned));
}

function summons(numPulls, sumType){
	let pull = 0;
	for (var i = 1; i <= numPulls; i++){
		pull = getRndInt(overallSumRoll)
		getSummon(pull, sumType);		
	}
}

//console.log(moonLightChars.hero3[0]);
summons(numPulls, sumType);
console.log(pulledSums);