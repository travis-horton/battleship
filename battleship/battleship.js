let doc = document;
let root = doc.getElementById("root");

class SetupDiv extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		this.props.handleSubmit(e);
	}

	render() {
		return (
			<div>
				<p>Limit length to 20 characters, which must be letters or numbers!</p>
				<ConfigSelector id = "playerName" type = "text" labelText = "Choose a player name: "/>
				<ConfigSelector id = "gameID" type = "text" labelText = "Choose a game id: "/>
				<ConfigSelector id = "boardSize"
					type = "number"
					labelText = "Choose your board size (10-20): "
					min = {10}
					max = {20}
				/>
				<ConfigSelector
					id = "numPlayers"
					type = "number"
					labelText = "Choose the number of players (2-4): "
					min = {2}
					max = {4}
				/>
				<button onClick = {this.handleSubmit}>Submit</button>
			</div>
		);
	}
}

class ConfigSelector extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let options = {
			type: this.props.type,
			id: this.props.id,
			name: this.props.id,
			autoComplete: "off"
		}

		if (this.props.type === "number") {
			options["min"] = this.props.min;
			options["max"] = this.props.max;
		}

		return (
			<div>
				<label htmlFor = {this.props.id}>{this.props.labelText}</label>
				<input {...options}/>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.handleNewGame = this.handleNewGame.bind(this);
		this.handleJoinGame = this.handleJoinGame.bind(this);
		this.handleConfigSubmit = this.handleConfigSubmit.bind(this);
		this.handleBoardInput = this.handleBoardInput.bind(this);
	}

	handleNewGame() {
		this.setState({
			configDone: false
		});
	}

	handleJoinGame() {
		alert("This is still under construction -- can't connect to games yet.")
	}

	handleConfigSubmit(e) {
		let button = e.target;
		let inputs = getInputsFromChildren(button.parentNode.children);

		if (!errorsInConfigInput(inputs)) {
			let state = createState(inputs);
			this.setState({...state});
		};
	}

	handleBoardInput(e) {
		console.log(e);
	}

	render() {
		let toDisplay = whatToDisplay(this.state);
		if (toDisplay === "chooseJoinOrNew") {
			return (
				<div>
					<button onClick = {this.handleNewGame}>New game</button>
					<button onClick = {this.handleJoinGame}>Join game</button>
				</div>
			)
		}

		if (toDisplay === "SetupDiv") {
			return (
				<SetupDiv handleSubmit = {this.handleConfigSubmit}/>
			)
		}

		if (toDisplay === "PickShips") {
			let shipPlacingInstructions = 'INSTRUCTIONS:\nNow you will place your ships.\nYou will place:\n5 \"a\"s -- These a\'s will be your aircraft carrier.\n4 \"b\"s -- These b\'s will be your battleship.\n3 \"c\"s -- These c\'s will be your cruiser.\n3 \"s\"s -- These s\'s will be your submarine.\n2 \"d\"s -- These d\'s will be your destroyer.\n\nEach ship must be in a line horizontally, vertically, or diagonally. In general, your ships are not allowed to cross one another. However, your submarine is allowed to cross other ships on the diagonal. (Currently you can actually just cross any ships you want...) No ships may share a cell.'

			return (
				<div className="flex_box">
					<div className="left_column">
						<p><b>INSTRUCTIONS</b></p>
						<p>Now you will place your ships. You will place:</p>
						<p>5 "a"s -- These a's will be your aircraft carrier.</p>
						<p>4 "b"s -- These b's will be your battleship.</p>
						<p>3 "c"s -- These c's will be your cruiser.</p>
						<p>3 "s"s -- These s's will be your submarine.</p>
						<p>2 "d"s -- These d's will be your destroyer.</p>
						<p>Each ship must be in a line horizontally, vertically, or diagonally. In general, your ships are not allowed to cross one another. However, your submarine is allowed to cross other ships on the diagonal. (Currently you can actually just cross any ships you want...) No ships may share a cell.</p>
					</div>
					<div className="right_column">
						<Board
							boardSize = {this.state.boardSize}
							handleInput = {this.handleBoardInput}
							player = {this.state.playerName}
							ships = {this.state.ships}
						/>
						<button onClick = {this.handleBoardSubmit}>Submit ship placement</button>
					</div>
				</div>
			)
		}
	}
}

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(e) {
		this.props.handleInput(e);
	}

	render() {
		let nRows = [];
		for (let i = 0; i < this.props.boardSize; i++) {
			nRows.push(i);
		}

		return (
			<div className = "board">
				<p>{this.props.player}'s board</p>
				<HeaderRow rowLength = {this.props.boardSize}/>
				{nRows.map((row) =>
					<Row
						rowLength = {this.props.boardSize}
						key = {row}
						row = {row + 1}
						ships = {this.props.ships}
						shots = {this.props.shots}
						handleInput = {this.handleInput}
					/>
				)}
				<HeaderRow rowLength = {this.props.boardSize}/>
			</div>
		)
	}
}

class Row extends React.Component {
	constructor(props) {
		super(props);
		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(e) {
		this.props.handleInput(e);
	}

	render() {
		let nCol = [];
		for (let i = 0; i < this.props.rowLength; i++) {
			nCol.push(String.fromCharCode(i + 65))
		}
		return (
			<div className="row">
				<HeaderCell label = {this.props.row}/>
				{nCol.map((col) =>
					<Cell
						key = {col}
						col = {col}
						row = {this.props.row}
						ships = {this.props.ships}
						shots = {this.props.shots}
						handleInput = {this.handleInput}
					/>
				)}
				<HeaderCell label = {this.props.row}/>
			</div>
		)
	}
}

class HeaderRow extends Row {
	render() {
		let nCol = [];
		for (let i = 0; i < this.props.rowLength; i++) {
			nCol.push(String.fromCharCode(i + 65))
		}
		return (
			<div className="row">
				<HeaderCell label = ""/>
				{nCol.map((col) =>
					<HeaderCell key = {col} label = {col}/>
				)}
				<HeaderCell label = ""/>
			</div>
		)
	}
}

class Cell extends React.Component {
	constructor(props) {
		super(props);
		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(e) {
		this.props.handleInput(e);
	}

	render() {
		return (
			<input
				col = {this.props.col}
				row = {this.props.row}
				onChange = {this.handleInput}
				className = "cell"
			/>
		)
	}
}

class HeaderCell extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<span> {this.props.label} </span>
		)
	}
}

ReactDOM.render(<Game/>, root);

function whatToDisplay(state) {
	if (!state) return "chooseJoinOrNew";
	if (!state.configDone) {
		return "SetupDiv";
	} else {
		return "PickShips";
	}
}

function errorsInConfigInput(input) {
	let computerToHuman = {
		playerName: "player name",
		gameID: "game id",
		boardSize: "board size",
		numPlayers: "number of players"
	}
	let regx = /^[A-Za-z0-9]+$/;

	for (let entry in input) {
		if (input[entry].length === 0) {
			alert(`You didn't choose a ${computerToHuman[entry]}. Try again.`);
			return true;
		}
	}

	if (!regx.test(input.playerName)) {
		alert(`You can only use letters or numbers in player name. Try again.`);
		return true;
	}

	if (!regx.test(input.gameID)) {
		alert(`You can only use letters or numbers in game id. Try again.`);
		return true;
	}

	if (!Number.isInteger(input.boardSize) || input.boardSize < 10 || input.boardSize > 20) {
		alert(`You must enter a whole number between 10 and 20 for board size. Try again.`);
		return true;
	}

	if (!Number.isInteger(input.numPlayers) || input.numPlayers < 2 || input.numPlayers > 4) {
		alert(`You must enter a whole number between 2 and 4 for number of players. Try again.`);
		return true;
	}

	return false;
}

function getInputsFromChildren(children) {
	let inputs = {};
	for (let i = 0; i < children.length; i ++) {
		let thisDiv = children[i];
		if (thisDiv.localName === "div") {
			let label = thisDiv.children[1].id;
			let value = thisDiv.children[1].value;
			if (!isNaN(parseFloat(value))) value = parseFloat(value);
			inputs[label] = value;
		}
	}
	return inputs;
}

function createState(inputs) {
	let state = {...inputs};

	state["ships"] = {
		a: {loc: null, max: 5},
		b: {loc: null, max: 4},
		c: {loc: null, max: 3},
		s: {loc: null, max: 3},
		d: {loc: null, max: 2}
	}
	state.users = {};
	state.users[inputs.playerName] = {connected: true, completed: false, turn: false, shots: [0]};
	state["configDone"] = true;

	return state;
}
