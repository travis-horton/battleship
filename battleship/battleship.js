let doc = document;
let root = doc.getElementById("root");

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.handleNewGame = this.handleNewGame.bind(this);
		this.handleJoinGame = this.handleJoinGame.bind(this);
		this.handleConfigSubmit = this.handleConfigSubmit.bind(this);
		this.handleBoardInput = this.handleBoardInput.bind(this);
		this.handleBoardSubmit = this.handleBoardSubmit.bind(this);
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
		let thisInput = e.target.value.toLowerCase();
		let c = e.target.attributes.col.nodeValue;
		let r = parseInt(e.target.attributes.row.nodeValue);
		thatGuy_ohDontWorryAboutThatGuy(c, r);

		if (thisInput.length === 0) {
			let newShips = newShipsWithoutThisLoc(c, r, this.state.ships);
			this.setState({
				ships: newShips
			})
			return;
		}

		if (!isShip(thisInput)) {
			alert(`"${thisInput}" is not a ship letter (a, b, c, s, or d).`);
			return false;
		}

		if (thisShipCanGoHere(thisInput, c, r, this.state.ships[thisInput])) {
			let newShips = this.state.ships;
			if (newShips[thisInput].locs[0] === null) {
				newShips[thisInput]
				newShips[thisInput].locs[0] = [c, r];
			} else {
				newShips[thisInput].locs.push([c, r]);
			}

			this.setState({
				ships: newShips
			})
		}

		{/*
		let thisCellValue = e.target.value.toLowerCase();
		let col = target.attributes.col.nodeValue;
		let row = parseFloat(target.attributes.row.nodeValue);
		if (!this.state.ships[thisCellValue] && thisCellValue.length > 0) this.state.ships[thisCellValue] = [];
		let ship = this.state.ships[thisCellValue];

		if (thisCellValue.length === 0) {
			let newShips = removeLoc(col, row, this.state.ships);
			this.setState({
				ships: newShips
			});

			database.ref(`${this.props.state.config.gameId}/${thisUser}/ships`).set(newShips);
			updateCompleted(this.state.ships);

			return false
		};

		if (!(thisCellValue in this.props.state.config.shipMax)) {
			alert('must be a ship letter (a, b, c, s, or d)');
			target.value = "";
			return false;
		}

		let newShips = this.state.ships;

		if (!goodPlacement(ship, col, row, thisCellValue)) {
			target.value = "";
			return false;
		}

		if (newShips[thisCellValue][0] === 0) newShips[thisCellValue].pop();

		newShips[thisCellValue].push([col, row]);

		this.setState({ships: newShips});
		database.ref(`${this.props.state.config.gameId}/${thisUser}/ships`).set(newShips);
		updateCompleted(this.state.ships);
		*/}

	}


	handleBoardSubmit(e) {
		{/*
		let completed = checkCompletion(this.state.ships);
		if (completed < 1) {
			alert('you have more ships to place!')
		} else {
			let confirm = window.confirm('are you happy with your ship placement?');
			if (confirm) {
				statusDiv.innerHTML = 'Waiting on:\n' + notDoneUsers.join('\n');
			}
		}
		*/}
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

		if (toDisplay === "PlaceShips") {
			return (
				<div className = "flex_box">
					<LeftColumn toDisplay = {toDisplay}/>
					<RightColumn
						toDisplay = {toDisplay}
						handleInput = {this.handleBoardInput}
						boardSize = {this.state.boardSize}
						player = {this.state.playerName}
						ships = {this.state.ships}
						handleSubmit = {this.handleBoardSubmit}
					/>
				</div>
			)
		}
	}
}

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

class LeftColumn extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.toDisplay === "PlaceShips") {
			return(
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
			)
		} else {
			return <p>shit i fucked up</p>
		}
	}
}

class RightColumn extends React.Component {
	constructor(props) {
		super(props);
		this.handleBoardInput = this.handleBoardInput.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleBoardInput(e) {
		this.props.handleInput(e);
	}

	handleSubmit(e) {
		this.props.handleSubmit(e);
	}

	render() {
		if (this.props.toDisplay === "PlaceShips") {
			return(
				<div className = "right_column">
					<Board
						boardSize = {this.props.boardSize}
						handleInput = {this.handleBoardInput}
						player = {this.props.player}
						ships = {this.props.ships}
					/>
					<br/>
					<button onClick = {this.handleSubmit}>Submit ship placement</button>
				</div>
			)
		} else {
			return <p>shit i fucked up</p>
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
				<span>{this.props.player}'s board</span>
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
			<div className="headerRow">
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
		let ship = whatShipIsHere(this.props.col, this.props.row, this.props.ships);
		return (
			<input
				col = {this.props.col}
				row = {this.props.row}
				onChange = {this.handleInput}
				className = "cell"
				value = {ship}
			/>
		)
	}
}

class HeaderCell extends React.Component {
	render() {
		return (
			<span className = "headerCell"> {this.props.label} </span>
		)
	}

}

ReactDOM.render(<Game/>, root);

function whatToDisplay(state) {
	if (!state) return "chooseJoinOrNew";
	if (!state.configDone) {
		return "SetupDiv";
	} else {
		return "PlaceShips";
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
		a: {locs: [null], max: 5},
		b: {locs: [null], max: 4},
		c: {locs: [null], max: 3},
		s: {locs: [null], max: 3},
		d: {locs: [null], max: 2}
	}
	state.users = {};
	state.users[inputs.playerName] = {connected: true, completed: false, turn: false, shots: [0]};
	state["configDone"] = true;

	return state;
}

function thatGuy_ohDontWorryAboutThatGuy(c, r) {
	let cRegex = /[A-Za-z]/;
	if (!cRegex.test(c)) {
		throw new Error("Column is not a letter");
	}
	if (!Number.isInteger(r)) {
		throw new Error("Row is not an integer");
	}
}

function isShip(value) {
	let regex = /^[ABCDSabcds]$/
	if (regex.test(value)) return true;
	return false;
}

function thisShipCanGoHere(thisShip, c, r, allShipsOfType) {
	let thisShipLoc = [c, r]
	let countOfThisShip = howManyShipsOfThisType(thisShip, allShipsOfType.locs);
	if (countOfThisShip >= allShipsOfType.max) {
		alert(`You can only place ${allShipsOfType.max} "${thisShip}"s and you've already placed ${allShipsOfType.max}.`)
		return false;
	}
	if (countOfThisShip === 0) return true;
	if (countOfThisShip === 1) return isAdjacent(thisShipLoc, allShipsOfType.locs)
	return (isAdjacent(thisShipLoc, allShipsOfType.locs) && isInLine(thisShipLoc, allShipsOfType.locs))
}

function howManyShipsOfThisType(type, allShips) {
	if (allShips[0] === null) return 0;
	return allShips.length;
}

function isAdjacent(thisShipLoc, otherShips) {
	for (let i = 0; i < otherShips.length; i++) {
		let testShipColumn = otherShips[i][0];
		let testShipRow = otherShips[i][1];

		if (isAdjacentColumn(testShipColumn, thisShipLoc[0]) && isAdjacentRow(testShipRow, thisShipLoc[1])) {
			return true;
		}
	}
	alert("That placement is not adjacent to others of its kind.")
	return false;
}

function isInLine(thisShipsLoc, otherShips) {
	let otherShipsOrientation = getOrientation([otherShips[0], otherShips[1]]);
	let thisShipsOrientation = getOrientation([otherShips[0], thisShipsLoc])
	console.log(otherShipsOrientation, thisShipsOrientation)
	if (otherShipsOrientation === thisShipsOrientation) return true;
	alert("That placement is not in line with others of its kind.")
	return false;
}

function whatShipIsHere(c, r, ships) {
	for (let ship in ships) {
		if (ships[ship].locs[0] === null) continue;
		for (let loc in ships[ship].locs) {
			if (ships[ship].locs[loc][0] === c && ships[ship].locs[loc][1] === r) {
				return (ship);
			}
		}
	}
	return "";
}

function isAdjacentColumn(c1, c2) {
	if (
		String.fromCharCode(c1.charCodeAt(0) - 1) === c2 ||
		String.fromCharCode(c1.charCodeAt(0) + 1) === c2 ||
		c1 === c2
	) {
		return true;
	}

	return false;
}

function isAdjacentRow(r1, r2) {
	if (r1 - 1 === r2 || r1 + 1 === r2 || r1 === r2) return true;

	return false;
}

function getOrientation(twoCells) {
	let firstCellC = twoCells[0][0];
	let firstCellR = twoCells[0][1];
	let secondCellC = twoCells[1][0];
	let secondCellR = twoCells[1][1];
	if (firstCellC === secondCellC) return "v";
	if (firstCellR === secondCellR) return "h";

	let firstCToNumber = firstCellC.charCodeAt(0);
	let secondCToNumber = secondCellC.charCodeAt(0);

	if (firstCToNumber-secondCToNumber === firstCellR-secondCellR) return "bd";
	if (firstCToNumber-secondCToNumber === -(firstCellR-secondCellR)) return "fd";
}

function newShipsWithoutThisLoc(c, r, ships) {
	let newShips = ships;
	for (let ship in ships) {
		for (let i = 0; i < ships[ship].locs.length; i++) {
			if (!ships[ship].locs[i]) continue;
			if (c === ships[ship].locs[i][0] && r === ships[ship].locs[i][1]) {
				newShips[ship].locs = [null];
				return newShips;
			}
		}
	}
}
