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
let statusDiv = doc.getElementById('currentStatus');
let state = {
	settings: {
		gameId: 'someGameID',
		numberOfPlayers: 0,
		boardSize: 0
	},
	users: {}
}
let thisUser = '';

let statusStrs = [
	'<b>INSTRUCTIONS:</b>\nNow you will place your ships.\nYou will place:\n5 \"a\"s -- These a\'s will be your aircraft carrier.\n4 \"b\"s -- These b\'s will be your battleship.\n3 \"c\"s -- These c\'s will be your cruiser.\n3 \"s\"s -- These s\'s will be your submarine.\n2 \"d\"s -- These d\'s will be your destroyer.\n\nEach ship must be in a line horizontally, vertically, or diagonally. In general, your ships are not allowed to cross one another. However, your submarine is allowed to cross other ships on the diagonal. No ships may share a cell.',
	'Waiting on other players...'
]

let database = firebase.database();

startNewGameButton.onclick = chooseNewGame;
joinGameButton.onclick = chooseJoinGame;
chooseSettingsForm.onSubmit = createGame;

function chooseJoinGame() {
	let gameId = window.prompt('Enter game ID:');
	let games = [];

	database.ref('games/').once('value')
	.then(function(data) {

		if (data.hasChild(gameId)) {
			database.ref(`games/${gameId}/state/settings`).once('value')
			.then(function(data) {
				state.settings = data.val();
			})
			database.ref(`games/${gameId}/state/users`).once('value')
			.then(function(data) {
				let users = data.val();
				thisUser = prompt('Choose a User ID:');

				if (data.hasChild(thisUser) && !users[thisUser].connected) {
					{/* rejoin logic: set connected to true, reset the disconnect listener */}
					let connected = database.ref(`games/${gameId}/state/users/${thisUser}/connected`);
					connected.set(true);
					connected.onDisconnect().set(false);

					{/* set user board */}
					database.ref(`games/${gameId}/state/users/${thisUser}`).once('value').then(
						function(user) {
							state.users[thisUser] = user.val();
							joinGame()
						}
					)

				} else if (data.numChildren() === parseFloat(state.settings.numberOfPlayers)) {
					alert('This game is full');
					return false;

				} else {
					if (data.hasChild(thisUser)) {
						thisUser = prompt('User ID taken, choose a different ID:')
					}
					initUser(thisUser);
					database.ref(`games/${gameId}/state/users/${thisUser}`).set(state.users[thisUser]);
					joinGame();
				}
			})
		} else {
			alert('no such game');
		}


	})

}

function joinGame() {
	hide(joinOrNewGameButtons);
	unhide(settingsDiv);
	unhide(statusDiv);
	statusDiv.innerHTML = statusStrs[0];

	userNameElement.innerHTML = thisUser;
	numberOfPlayersElement.innerHTML = state.settings.numberOfPlayers;
	gameIdElement.innerHTML = state.settings.gameId;

	ReactDOM.render(< Game state={ state }/>, root);

	return false;
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
	let gameId = e.form.choose_game_name.value;

	if (id.length === 0 || nP < 2 || nP > 4 || bSize < 10 || bSize > 20 || gameId.length === 0) {
		window.alert('fail')
		return false;
	}

	hide(chooseSettingsDiv);
	unhide(settingsDiv);
	unhide(statusDiv);
	statusDiv.innerHTML = statusStrs[0];
	setSettings(id, nP, bSize, gameId, e.form);

	ReactDOM.render(< Game state={ state }/>, root);

	return false;
};

function hide(element) {
	element.classList.add('hidden');
}

function unhide(element) {
	element.classList.remove('hidden');
}

function setSettings(id, nP, bSize, gameId, form) {
	if (id.length === 0 || nP < 2 || nP > 4 || bSize < 10 || bSize > 20) {
		window.alert('fail')
		return false;
	}

	let settings = state.settings;

	userNameElement.innerHTML = id;
	form.choose_ID.value = '';

	settings.numberOfPlayers = nP;
	numberOfPlayersElement.innerHTML = nP;
	form.choose_num_of_players.value = '';

	settings.gameId = gameId;
	gameIdElement.innerHTML = gameId;
	form.choose_game_name.value = '';

	settings.boardSize = parseFloat(bSize);
	form.choose_size.value = '';

	initUser(id);

	database.ref('games/' + gameId).set({state});
	database.ref('games/' + gameId + '/state/users/' + thisUser).set(state.users[thisUser]);

}

function initUser(id) {
	thisUser = id;

	state.users[`${thisUser}`] = {
		ships: {
			a: {max: 5, locs: [0], o: ''},
			b: {max: 4, locs: [0], o: ''},
			c: {max: 3, locs: [0], o: ''},
			s: {max: 3, locs: [0], o: ''},
			d: {max: 2, locs: [0], o: ''},
		},
		shots: [0],
		completion: 0,
		connected: true
	}
	let gameId = state.settings.gameId;


	let connected = database.ref(`games/${gameId}/state/users/${id}/connected`);
	connected.onDisconnect().set(false);
}

class Cell extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		this.props.handleChange(e.target);
	}

	render() {
		let className = 'cell';
		className = addClass(className, this.props.col, this.props.row);
		let value = checkForShipHere(this.props.ships, this.props.col, this.props.row);
		return (
			<input
				className={ className }
				col={ this.props.col }
				row={ this.props.row }
				value={ value }
				onChange={ this.handleChange }
			/>
		)
	}
}

function checkForShipHere(s, c, r) {
	for (let ship in s) {
		for (let loc in s[ship].locs) {
			if (s[ship].locs[loc][0] === c && s[ship].locs[loc][1] === r) return ship;
		}
	}
	return '';
}

class HeaderCell extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let className = 'headerCell ';
		if (this.props.className) className += this.props.className;

		return (
			<span key={ this.props.label } className={ className }>{ this.props.label }</span>
		)
	}
}

class Row extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(target) {
		this.props.handleInput(target);
	}

	render() {
		let row = [];
		for (let i = 0; i < state.settings.boardSize; i++) {
			row.push(String.fromCharCode(i + 65))
		}
		return (
			<div className = 'row'>
				<HeaderCell label={ this.props.row } className='rowHeaderCell'/>
				{ row.map((cell) =>
					<Cell
						key={ cell }
						col={ cell }
						row={ this.props.row }
						ships={ this.props.ships }
						shots={ this.props.shots }
						handleChange={ this.handleChange }
					/>
				) }
				<HeaderCell label={ this.props.row } className='rowHeaderCell'/>
			</div>
		)
	}
}

class HeaderRow extends Row {
	render() {
		let row = [];
		for (let i = 0; i < state.settings.boardSize; i++) {
			row.push(String.fromCharCode(i + 65))
		}
		return (
			<div className = 'row'>
				<HeaderCell label='' className='rowHeaderCell'/>
				{ row.map((cell) =>
					<HeaderCell key={ cell } label={ cell }/>
				) }
				<HeaderCell label='' className='rowHeaderCell'/>
			</div>
		)
	}
}

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.handleInput = this.handleInput.bind(this);
		this.state = {
			ships: this.props.ships,
			shots: this.props.shots
		}
	}

	handleInput(target) {
		this.props.handleInput(target);
	}

	render() {
		let rows = [];
		let ships = [];
		for (let i = 0; i < state.settings.boardSize; i++) {
			rows.push( i );

			for (let ship in this.state.ships) {
				for (let loc in this.state.ships[ship].locs) {
					let thisShipLoc = this.state.ships[ship].locs[loc];
					if (thisShipLoc[0] === String.fromCharCode(i + 65)) {
						ships[i] = "check"
					}
				}
			}
		}

		let className='board';
		if (this.props.className) {
			className += " "+this.props.className;
		}
		return (
			<div>
				<div className={ className }>
					<p>{ this.props.player }'s board</p>
					<HeaderRow/>
					{ rows.map((row) =>
						<Row
							key={ row }
							row={ row + 1 }
							ships={ this.props.ships }
							shots={ this.props.shots }
							handleInput={ this.handleInput }
						/>
					) }
					<HeaderRow/>
				</div>
			</div>
		)
	}
}

class SubmitButton extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.props.handleClick();
	}

	render() {
		return (
			<button onClick={ this.handleClick }>Submit</button>
		)
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.state = props.state;
	}

	handleSubmit() {
		if (state.completion !== 1) {
			alert('you have more ships to place!')
		} else {
			let confirm = window.confirm('are you happy with your ship placement?');
			if (confirm) {
				statusDiv.innerHTML = statusStrs[1];
				showBoards();
			}
		}
	}

	handleInput(target) {
		let ships = state.users[thisUser].ships;
		let col = target.attributes.col.nodeValue;
		let row = parseFloat(target.attributes.row.nodeValue);
		let ship = target.value.toLowerCase();

		if (target.value.length === 0) {
			removeLoc(col, row);
			state.completion = numShipsPlaced()/5;
			return false
		};

		if (!(target.value in ships)) {
			alert('must be a ship letter (a, b, c, s, or d)');
			removeLoc(col, row);
			state.completion = numShipsPlaced()/5;
			target.value = "";
			return false;
		}

		ship = ships[ship];

		if (!(goodPlacement(ship, col, row, target.value.toLowerCase()))) {
			target.value = "";
			state.completion = numShipsPlaced()/5;
			return false;
		}

		ship.locs.push([col, row]);
		state.users[thisUser].completion = numShipsPlaced()/5;
		database.ref(`games/${state.settings.gameId}/state/users/${thisUser}`).set(state.users[thisUser]);

		console.log(this.state);
	}

	render() {
		let otherBoards = [];
		for (let i = 0; i < state.settings.numberOfPlayers - 1; i++) {
			otherBoards.push({key: i + 1})
		}
		let className;
		if (state.users[thisUser].completion < 1) className='hidden'
		return (
			<div>
				< Board
					handleInput={ this.handleInput }
					key='0'
					player={ thisUser }
					ships={ this.state.users[thisUser].ships }
					shots={ this.state.users[thisUser].shots }
				/>
				{ otherBoards.map((board) =>
					< Board
						handleInput={ this.handleInput }
						key={ board.key }
						className={ className }
						player='unknown'
						ships={ this.state.users[thisUser].ships }
						shots={ this.state.users[thisUser].shots }
					/>
				) }
				< SubmitButton
					handleClick={ this.handleSubmit }
				/>
			</div>
		)
	}
}

function addClass(className, col, row) {
	if (col === String.fromCharCode(parseFloat(state.settings.boardSize) + 64)) className += ' rightColumnCell';
	if (row == state.settings.boardSize) className += ' bottomRowCell';
	return className;
}

function goodPlacement(ship, col, row, shipName) {
	if (ship.locs[0] === 0) {
		ship.locs.pop();
		return true;
	}
	if (ship.locs.length === ship.max) {
		alert('too many of this ship')
		return false;
	}

	let col0 = col.charCodeAt(0) - 65;
	let row0 = row - 1;
	let index = col0 + (row0 * state.settings.boardSize);

	if (ship.locs.length === 1) {
		//check adjacency
		return checkPWOneShip(ship, index);
	}

	if (ship.locs.length > 1) {
		return checkPWMOneShip(ship, index);
	}

	return true;
}

function isAdjacent(i1, i2) {
	let colDif = Math.abs(i1 - i2);
	let bSize = state.settings.boardSize
	let adj = [1, bSize - 1, bSize, bSize + 1];
	let o = ['h', 'db', 'v', 'df'][adj.indexOf(colDif)];
	return o;
}

function removeLoc(col, row) {
	let ships = state.ships;
	for (let ship in ships) {
		ships[ship].locs.forEach(function(loc, i) {
			if (loc[0] === col && loc[1] === row) {
				ships[ship].locs.splice(i, 1);
			}
		})
	}
}

function numShipsPlaced() {
	let num = 0;
	for (let ship in state.users[thisUser].ships) {
		if (state.users[thisUser].ships[ship].max === state.users[thisUser].ships[ship].locs.length) {
			num ++;
		}
	}
	return num;
}

function checkPWOneShip(ship, index) {
	let col1 = ship.locs[0][0].charCodeAt(0) - 65;
	let row1 = ship.locs[0][1] - 1;
	let index1 = col1 + (row1 * state.settings.boardSize);
	let o = isAdjacent(index, index1);

	if (o === undefined) {
		alert('ship is not adjacent')
		return false;
	} else {
		ship.o = o;
		return true;
	}
}

function checkPWMOneShip(ship, index) {
	let o = undefined;
	for (let i = 0; i < ship.locs.length; i++) {
		let loc = ship.locs[i];
		let col1 = loc[0].charCodeAt(0) - 65;
		let row1 = loc[1] - 1;
		let index1 = col1 + (row1 * state.settings.boardSize);
		o = isAdjacent(index, index1);
		if (o !== undefined) {
			if (o === ship.o) {
				break;
			} else {
				alert('ship is not in line');
				return false;
			}

		}
		if (i === ship.locs.length - 1) {
			alert('ship is not adjacent')
			return false;
		}
	}
	return true;
}

function showBoards() {
	ReactDOM.render(< Game state={ state }/>, root);
}
