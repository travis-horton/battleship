let doc = document;
let root = doc.getElementById('root');
let startNewGameButton = doc.getElementById('new');
let joinGameButton = doc.getElementById('join');
let joinOrNewGameButtons = doc.getElementById('join_or_start');
let chooseSettingsDiv = doc.getElementById('chooseSettings');
let settingsDiv = doc.getElementById('settings');
let gameIdElement = doc.getElementById('game_id');
let userNameElement = doc.getElementById('user_name');
let numberOfPlayersElement = doc.getElementById('num_players');
let chooseSettingsForm = doc.getElementById('chooseSettings');
let instrDiv = doc.getElementById('instructions');

let state = {
	settings: {
		gameId: "someGameID",
		thisUser: "",
		numberOfPlayers: 0,
		boardSize: 0
	}
}

startNewGameButton.onclick = chooseNewGame;
joinGameButton.onclick = chooseJoinGame;
chooseSettingsForm.onSubmit = createGame;

function chooseJoinGame() {
	let gameId = window.prompt("Enter game ID:");
	if (gameId) {

	} else {
		gameId = prompt("Invalid game ID, try again");
	}
}

function chooseNewGame() {
	hide(joinOrNewGameButtons);
	unhide(chooseSettingsDiv);
	doc.getElementById('choose_ID').focus();
}

function createGame(e) {
	let id = e.form.choose_ID.value;
	let nP = e.form.choose_num_of_players.value;
	let bSize = e.form.choose_size.value;

	if (id.length === 0 || nP < 2 || nP > 4 || bSize < 10 || bSize > 20) {
		window.alert("fail")
		return false;
	}

	hide(chooseSettingsDiv);
	unhide(settingsDiv);
	unhide(instrDiv);
	setSettings(id, nP, bSize, e.form);

	console.log(state);

	return false;
};

function hide(element) {
	element.classList.add('hidden');
}

function unhide(element) {
	element.classList.remove('hidden');
}

function setSettings(id, nP, bSize, form) {

	if (id.length === 0 || nP < 2 || nP > 4 || bSize < 10 || bSize > 20) {
		window.alert("fail")
		return false;
	}

	let settings = state.settings;

	settings.thisUser = id;
	userNameElement.innerHTML = id;
	form.choose_ID.value = '';

	settings.numberOfPlayers = nP;
	numberOfPlayersElement.innerHTML = nP;
	form.choose_num_of_players.value = '';

	//makes a game board of e.form.choose_size.value
	settings.boardSize = bSize;
	form.choose_size.value = '';

	gameIdElement.innerHTML = 'randomgameinfo';
	state.ships = {a: [], b: [], c: [], s: [], d: []};
	state.shots = []; //array of arrays -- each round is an array
}
