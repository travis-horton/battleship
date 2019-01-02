/*
	in the middle of refactoring--changing the nature of the state object and changing how orientation of ships is determined...(needs to be done when needed, not stored)
*/

let doc = document;
let root = doc.getElementById('root');
let startNewGameButton = doc.getElementById('new');
let joinGameButton = doc.getElementById('join');
let joinOrNewGameButtons = doc.getElementById('join_or_start');
let chooseConfigDiv = doc.getElementById('chooseConfig');
let configDiv = doc.getElementById('config');
let statusDiv = doc.getElementById('currentStatus');
let database = firebase.database();
let statusStrs = [
	'<b>INSTRUCTIONS:</b>\nNow you will place your ships.\nYou will place:\n5 \"a\"s -- These a\'s will be your aircraft carrier.\n4 \"b\"s -- These b\'s will be your battleship.\n3 \"c\"s -- These c\'s will be your cruiser.\n3 \"s\"s -- These s\'s will be your submarine.\n2 \"d\"s -- These d\'s will be your destroyer.\n\nEach ship must be in a line horizontally, vertically, or diagonally. In general, your ships are not allowed to cross one another. However, your submarine is allowed to cross other ships on the diagonal. No ships may share a cell.',
	'Waiting on other users...'
]
let thisUser = '';
let state = {
	config: {
		gameId: '',
		users: {
			/*   eventually looks like this for each user:
			userName: {
				connected: true/false,
				completed: 0-1,
			}
			*/
		},
		boardSize: 0,
		shipMaxes: {
			a: 5,
			b: 4,
			c: 3,
			s: 3,
			d: 2
		},
		maxUsers: ''
	}
	/*   eventually looks like this:
	${thisUser}: {
		ships: {
			a: [0],
			b: [0],
			c: [0],
			s: [0],
			d: [0]
		},
		shots: [0],
	}
	*/
}

startNewGameButton.onclick = chooseNewGame;

function chooseNewGame() {
	hide(joinOrNewGameButtons);
	unhide(chooseConfigDiv);
	doc.getElementById('choose_ID').focus();
}

chooseConfigDiv.onSubmit = createGame;

function createGame(e) {
	let userId = e.form.choose_ID.value;
	let nP = e.form.choose_num_of_users.value;
	let bSize = e.form.choose_size.value;
	let gameId = e.form.choose_game_name.value;

	if (userId.length === 0 || nP < 2 || nP > 4 || bSize < 10 || bSize > 20 || gameId.length === 0) {
		window.alert('fail')
		return false;
	}

	hide(chooseConfigDiv);
	unhide(configDiv);
	unhide(statusDiv);
	setConfig(userId, nP, bSize, gameId, e.form);
	statusDiv.innerHTML = statusStrs[0];

	ReactDOM.render(< Game state={ state }/>, root);

	setUpdate();

	return false;
};

function setConfig(userId, nP, bSize, gameId, form) {

	let gameIdElement = doc.getElementById('game_id');
	let userNameElement = doc.getElementById('user_name');
	let numberOfUsersElement = doc.getElementById('num_users');
	let playersElement = doc.getElementById('players');
	let config = state.config;

	config.gameId = gameId;
	gameIdElement.innerHTML = gameId;

	config.maxUsers = nP;
	numberOfUsersElement.innerHTML = nP;

	config.boardSize = parseFloat(bSize);

	initUser(userId, gameId);
	userNameElement.innerHTML = thisUser;

	let users = Object.keys(state.config.users);
	playersElement.innerHTML = users.join(', ');

	database.ref(gameId + '/config/').set(state.config)
}

joinGameButton.onclick = chooseJoinGame;

function chooseJoinGame() {
	let gameId = window.prompt('Enter game ID:');

	database.ref().once('value')
	.then(function(gamesData) {
		if (!gamesData.hasChild(gameId)) {
			alert('no such game');
			return false;
		};


		database.ref(`${gameId}/config`).once('value')
		.then(function(configData) {
			state.config = configData.val();

			database.ref(`${gameId}/config/users`).once('value')
			.then(function(usersData) {
				let users = usersData.val();
				thisUser = prompt('Choose a User ID:');

				if (usersData.hasChild(thisUser)) {
					if (!users[thisUser].connected) {
						{/* rejoin logic: set connected to true, reset the disconnected listener */}
						let connected = database.ref(`${gameId}/config/users/${thisUser}/connected`);
						connected.set(true);
						connected.onDisconnect().set(false);

						{/* set user board */}
						database.ref(`${gameId}/${thisUser}`).once('value').then(
							function(user) {
								state[thisUser] = user.val();
								joinGame();
							}
						)

					} else {
						alert('that user is already connected');
						return false;
					}

				} else if (usersData.numChildren() >= parseFloat(state.config.maxUsers)) {
					alert('This game is full');
					return false;

				} else {
					if (usersData.hasChild(thisUser)) {
						thisUser = prompt('User ID taken, choose a different ID:')
					}
					initUser(thisUser, gameId);
					joinGame();
				}
			})
		})
	})

}

function joinGame() {
	hide(joinOrNewGameButtons);
	unhide(configDiv);
	unhide(statusDiv);

	let gameIdElement = doc.getElementById('game_id');
	let userNameElement = doc.getElementById('user_name');
	let numberOfUsersElement = doc.getElementById('num_users');

	statusDiv.innerHTML = statusStrs[0];

	userNameElement.innerHTML = thisUser;
	numberOfUsersElement.innerHTML = state.config.maxUsers;
	gameIdElement.innerHTML = state.config.gameId;

	ReactDOM.render(< Game state={ state }/>, root);

	setUpdate();

	let playersElement = doc.getElementById('players');
	let users = Object.keys(state.config.users);
	playersElement.innerHTML = users.join(', ');

	return false;
}

function initUser(userId, gameId) {
	thisUser = userId;

	state[thisUser] = {
		ships: {
			a: [0],
			b: [0],
			c: [0],
			s: [0],
			d: [0]
		},
		shots: [0]
	}

	state.config.users[thisUser] = {
		connected: true,
		completed: 0
	}

	database.ref(`${gameId}/${thisUser}`).set(state[thisUser]);
	database.ref(`${gameId}/config/users/${thisUser}`).set(state.config.users[thisUser]);
	let connected = database.ref(`${gameId}/config/users/${thisUser}/connected`);
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
		for (let i = 0; i < this.props.rowLength; i++) {
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
		for (let i = 0; i < this.props.rowLength; i++) {
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
			ships: this.props.ships
		}
	}

	handleInput(target) {
		this.props.handleInput(target);
	}

	render() {
		let rows = [];
		let ships = [];
		for (let i = 0; i < this.props.boardSize; i++) {
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
					<p>{ this.props.user }'s board</p>
					<HeaderRow rowLength={ this.props.boardSize }/>
					{ rows.map((row) =>
						<Row
							rowLength={ this.props.boardSize }
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
		if (this.state.completion !== 1) {
			alert('you have more ships to place!')
		} else {
			let confirm = window.confirm('are you happy with your ship placement?');
			if (confirm) {
				statusDiv.innerHTML = statusStrs[1];
			}
		}
	}

	handleInput(target) {
		let ships = this.state[thisUser].ships;
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
		
		this.state.users[thisUser].completion = numShipsPlaced()/5;
		database.ref(`${this.state.config.gameId}/config/users/${thisUser}`).set(this.state.users[thisUser]);
	}

	render() {
		let users = [];
		for (let user in this.state.config.users) {
			if (!this.state[user])
			users.push(user);
		}
		return (
			<div>
				< Board
					boardSize={ this.state.config.boardSize }
					handleInput={ this.handleInput }
					key='0'
					user={ thisUser }
					ships={ this.state[thisUser].ships }
				/>
				{ users.map(user =>
					< Board
						boardSize={ this.state.config.boardSize }
						key={ user }
						user={ user }
						shots={ this.state[thisUser].shots }
					/>
				)}
				< SubmitButton
					handleClick={ this.handleSubmit }
				/>
			</div>
		)
	}
}

function addClass(className, col, row) {
	if (col === String.fromCharCode(parseFloat(state.config.boardSize) + 64)) className += ' rightColumnCell';
	if (row == state.config.boardSize) className += ' bottomRowCell';
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
	let index = col0 + (row0 * state.config.boardSize);

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
	let bSize = state.config.boardSize
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
	let index1 = col1 + (row1 * state.config.boardSize);
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
		let index1 = col1 + (row1 * state.config.boardSize);
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

function hide(element) {
	element.classList.add('hidden');
}

function unhide(element) {
	element.classList.remove('hidden');
}

function checkForShipHere(s, c, r) {
	for (let ship in s) {
		for (let loc in s[ship].locs) {
			if (s[ship].locs[loc][0] === c && s[ship].locs[loc][1] === r) return ship;
		}
	}
	return '';
}

//this doesn't work yet... it's not re-rendering...
function setUpdate() {
	database.ref(`${state.config.gameId}/config`).on('value', function(dataSnapshot) {
		let localState = {
			config: dataSnapshot.val(),
		}
		localState[thisUser] = state[thisUser];

		let playersElement = doc.getElementById('players');
		let users = Object.keys(localState.config.users);
		playersElement.innerHTML = users.join(', ');

		ReactDOM.render(< Game state={ localState }/>, root);
	})
}
