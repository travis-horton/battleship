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

let instrStrs = [
	'<b>instructions:</b>\nnow you will place your ships.\nyou will place:\n5 \"a\" -- these a\'s will be your aircraft carrier.\n4 \"b\" -- these b\'s will be your battleship.\n3 \"c\" -- these c\'s will be your cruiser.\n3 \"s\" -- these s\'s will be your submarine.\n2 \"d\" -- these d\'s will be your destroyer.\n\neach ship must be in a line horizontally, vertically, or diagonally. your submarine is allowed to cross other ships.'
]

let state = {
	settings: {
		gameId: 'someGameID',
		thisUser: '',
		numberOfPlayers: 0,
		boardSize: 0
	},

	ships: {
		a: {
			max: 5,
			locs: []
		},

		b: {
			max: 4,
			locs: []
		},

		c: {
			max: 3,
			locs: []
		},

		s: {
			max: 3,
			locs: []
		},

		d: {
			max: 2,
			locs: []
		}
	},

	shots: []
}

startNewGameButton.onclick = chooseNewGame;
joinGameButton.onclick = chooseJoinGame;
chooseSettingsForm.onSubmit = createGame;

function chooseJoinGame() {
	let gameId = window.prompt('Enter game ID:');
	if (gameId === null) return;
	if (gameId) {

	} else {
		gameId = prompt('Invalid game ID, try again');
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
		window.alert('fail')
		return false;
	}

	hide(chooseSettingsDiv);
	unhide(settingsDiv);
	unhide(statusDiv);
	statusDiv.innerHTML = instrStrs[0];
	setSettings(id, nP, bSize, e.form);

	ReactDOM.render(< Game state={ state }/>, root);

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
		window.alert('fail')
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
		return (
			<input
				className={ className }
				col={ this.props.col }
				row={ this.props.row }
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
	}

	handleInput(target) {
		this.props.handleInput(target);
	}

	render() {
		let rows = [];
		for (let i = 0; i < state.settings.boardSize; i++) {
			rows.push( i )
		}
		return (
			<div>
				<div className='board'>
					<p>{ state.settings.thisUser }'s board</p>
					<HeaderRow/>
					{ rows.map((row) =>
						<Row
							key={ row }
							row={ row + 1 }
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
	}

	handleInput(target) {
		let ships = state.ships;
		let col = target.attributes.col.nodeValue;
		let row = parseFloat(target.attributes.row.nodeValue);

		if (!(target.value in ships)) {
			alert('must be a ship letter (a, b, c, s, or d)');
			target.value = "";
			return false;
		}

		let ship = ships[target.value];

		if (badPlacement(ship, col, row)) {
			alert(badPlacement(ship, col, row));
			target.value = "";
			return false;
		}

		ship.locs.push([col, row]);
		console.log(target);
		console.log(ships);
	}

	render() {
		return (
			<div>
				< Board
					handleInput={ this.handleInput }
				/>
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

function badPlacement(ship, col, row) {
	if (false) {return "bad spot"}
}
