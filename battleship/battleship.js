let doc = document;
let root = doc.getElementById("root");
let database = firebase.database();

class Game extends React.Component {
    state = {
        boardSize: 0,
        gameId: "",
        numPlayers: 0,
        playerName: "",
        ships: {
            a: {locs: [0], max: 5},
            b: {locs: [0], max: 4},
            c: {locs: [0], max: 3},
            s: {locs: [0], max: 3},
            d: {locs: [0], max: 2}
        },
        shots: [],
        players: {
            "": {
                connected: true,
                thisPlayerTurn: false,
                shipsCommitted: false
            }
        }
    }

    constructor(props) {
       super(props);
       this.handleNewGame = this.handleNewGame.bind(this);
       this.handleJoinGame = this.handleJoinGame.bind(this);
       this.handleConfigSubmit = this.handleConfigSubmit.bind(this);
       this.handleBoardInput = this.handleBoardInput.bind(this);
       this.handleBoardSubmit = this.handleBoardSubmit.bind(this);
    }

    handleNewGame() {
        this.setState({numPlayers: 1});
    }

    handleJoinGame() {
        let self = this;
        let gameId = prompt("Enter game id: ");
        while (!gameId) gameId = prompt("Enter game id: ");
        database.ref(gameId).once('value', function(snapshot) {
            if (!snapshot.exists()) {
                alert("No such game in database.");
                return;
            }

            if (snapshot.val().players.length >= snapshot.val().numPlayers) {
                alert("Game is full.");
                return;
            }

            let playerName = choosePlayerName();

            database.ref(`${gameId}/players`).once("value").then(function(players) {
                while (players.hasChild(playerName) && players.val()[playerName].connected) {
                    playerName = choosePlayerName("That name is already taken. ");
                }

                if (players.hasChild(playerName) && !players.val()[playerName].connected) {
                    database.ref(`${gameId}/players/${playerName}/connected`).set(true);
                    database.ref(`${gameId}/players/${playerName}/connected`).onDisconnect().set(false);

                } else {
                    let thisPlayerInfo = {
                        connected: true,
                        thisPlayerTurn: false,
                        shipsCommitted: false
                    };
                    database.ref(`${gameId}/players/${playerName}`).set(thisPlayerInfo)
                }

                database.ref(gameId).on('value', function(snapshot) {
                    let fBState = snapshot.val();

                    let newState = {
                        boardSize: fBState.boardSize,
                        gameId: gameId,
                        numPlayers: fBState.numPlayers,
                        playerName: playerName,
                        players: fBState.players
                    }

                    if (snapshot.val()[(playerName + "Ships")] !== undefined) {
                        newState.ships = snapshot.val()[(playerName + "Ships")];
                    }

                    if (snapshot.val()[(playerName + "Shots")] !== undefined) {
                        newState.shots = snapshot.val()[(playerName + "Shots")];
                    }

                    self.setState(newState);
                });
            })
        })

    }

    handleConfigSubmit(config) {
        if (!errorsInConfigInput(config)) {
            let players = {};
            players[config.playerName] = {
                connected: true,
                thisPlayerTurn: false,
                shipsCommitted: false
            };

            let firebaseState = {
                boardSize: config.boardSize,
                gameId: config.gameId,
                numPlayers: config.numPlayers,
                players: {...players}
            }

            let self = this;
            database.ref(config.gameId).set(firebaseState);
            database.ref(config.gameId).on('value', function(snapshot) {
                let newState = snapshot.val();
                newState.playerName = config.playerName;
                self.setState(newState);
            });
            database.ref(`${config.gameId}/players/${config.playerName}/connected`).onDisconnect().set(false);
        }
    }

    handleBoardInput(e) {
        let thisInput = e.target.value.toLowerCase();
        let c = e.target.attributes.col.nodeValue;
        let r = parseInt(e.target.attributes.row.nodeValue, 10);

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
            if (newShips[thisInput].locs[0] === 0) {
                newShips[thisInput].locs[0] = [c, r];

            } else {
                newShips[thisInput].locs.push([c, r]);
            }

            this.setState({
                ships: newShips
            })
        }
    }

    handleBoardSubmit(e) {
        if (!allShipsArePlaced(this.state.ships)) {
            alert("You have more ships to place!");

        } else if (confirm("Are you happy with your ship placement?")) {
            database.ref(`${this.state.gameId}/players/${this.state.playerName}/shipsCommitted`).set(true);
            database.ref(`${this.state.gameId}/${this.state.playerName + "Ships"}`).set(this.state.ships);
            database.ref(`${this.state.gameId}/${this.state.playerName + "Shots"}`).set([0]);
        }
    }

    render() {
        if (this.state.numPlayers === 0) {
            return (
                <div>
                    <button onClick={this.handleNewGame}>New game</button>
                    <button onClick={this.handleJoinGame}>Join game</button>
                </div>
            )

        } else if (this.state.numPlayers === 1) {
            return (
                <Setup handleSubmit={this.handleConfigSubmit}/>
            )

        } else if (!this.state.players[this.state.playerName].shipsCommitted) {
            let thisPlayer = {
                name: this.state.playerName,
                ...this.state.players[this.state.playerName]
            };
            return (
                <div className="flex_box">
                    <Instructions />
                    <BoardArea
                        handleInput={this.handleBoardInput}
                        boardSize={this.state.boardSize}
                        thisPlayer={thisPlayer}
                        ships={this.state.ships}
                        handleSubmit={this.handleBoardSubmit}
                    />
                </div>
            )

        } else {
            let thisPlayer = {
                name: this.state.playerName,
                ...this.state.players[this.state.playerName]
            };
            let allPlayers = Object.keys(this.state.players);

            return (
                <div>
                    <BoardArea
                        handleInput={this.handleBoardInput}
                        handleSubmit={this.handleBoardSubmit}
                        boardSize={this.state.boardSize}
                        thisPlayer={thisPlayer}
                        ships={this.state.ships}
                        shots={this.state.shots}
                        players={allPlayers}
                    />
                </div>
            )
        }
    }
}

class Setup extends React.Component {
    state = {
        playerName: "",
        gameId: "",
        boardSize: 0,
        numPlayers: 0
    }

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e, id) {
        this.setState({[id]: e.target.value})
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.handleSubmit({
            playerName: this.state.playerName,
            gameId: this.state.gameId,
            boardSize: Number(this.state.boardSize),
            numPlayers: Number(this.state.numPlayers)
        });
    }

    render() {
        return (
            <div>
                <p>Limit length to 20 characters, which must be letters or numbers!</p>
                <form onSubmit={this.props.onSubmit}>
                    <ConfigSelector
                        id="playerName"
                        type="text"
                        labelText="Choose a player name: "
                        value={this.state.playerName}
                        onChange={this.handleChange}
                    />
                    <ConfigSelector
                        id="gameId"
                        type="text"
                        labelText="Choose a game id: "
                        value={this.state.gameId}
                        onChange={this.handleChange}
                    />
                    <ConfigSelector
                        id="boardSize"
                        type="number"
                        labelText="Choose your board size (10-20): "
                        min={10}
                        max={20}
                        value={this.state.boardSize}
                        onChange={this.handleChange}
                    />
                    <ConfigSelector
                        id="numPlayers"
                        type="number"
                        labelText="Choose the number of players (2-4): "
                        min={2}
                        max={4}
                        value={this.state.numPlayers}
                        onChange={this.handleChange}
                    />
                    <button type="submit" onClick={this.handleSubmit}>Submit</button>
                </form>
            </div>
        );
    }
}

class ConfigSelector extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.props.onChange(e, this.props.id);
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
                <label htmlFor={this.props.id}>
                    {this.props.labelText}
                </label>
                <input onChange={this.onChange} {...options}/>
            </div>
        );
    }
}

class Instructions extends React.Component {
    render() {
        if (!this.props.ships) {
            return (
                <div className="left_column">
                    <p><b>INSTRUCTIONS</b></p>
                    <p>Now you will place your ships.You will place:</p>
                    <p> 5 "a"s--These a 's will be your aircraft carrier.</p>
                    <p> 4 "b"s--These b 's will be your battleship.</p>
                    <p> 3 "c"s--These c 's will be your cruiser.</p>
                    <p> 3 "s"s--These s 's will be your submarine.</p>
                    <p> 2 "d"s--These d 's will be your destroyer.</p>
                    <p>
                        Each ship must be in a line horizontally, vertically, or diagonally.In general, your ships are not allowed to cross one another.However, your submarine is allowed to cross other ships on the diagonal.(Currently you can actually just cross any ships you want...) No ships may share a cell.
                    </p>
                </div>
            )

        } else {
            return <p>you've placed enough ships</p>
        }
    }
}

class BoardArea extends React.Component {
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
        if (!this.props.thisPlayer.shipsCommitted) {
            return (
                <div className="right_column">
                    <InputBoard
                        boardSize={this.props.boardSize}
                        handleInput={this.handleBoardInput}
                        player={this.props.thisPlayer.name}
                        ships={this.props.ships}
                    />
                    <br/>
                    <br/>
                    <button onClick={this.handleSubmit}>Submit ship placement</button>
                </div>
            )
        } else {
            let players = this.props.players;

            return (
                <div>
                    <StaticBoard
                        boardSize={this.props.boardSize}
                        boardOwner={"shooting"}
                        ships={this.props.ships}
                        shots={this.props.shots}
                        thisPlayer={this.props.thisPlayer.name}
                    />
                    <br/>
                    <button onClick={this.handleShoot}> Fire ze missiles! </button>
                    <br/>
                    {
                        players.map((boardOwner) =>
                            <StaticBoard
                                key={boardOwner}
                                boardSize={this.props.boardSize}
                                boardOwner={boardOwner}
                                ships={this.props.ships}
                                shots={this.props.shots}
                                thisPlayer={this.props.thisPlayer.name}
                            />
                        )
                    }
                </div>
            )
        }
    }
}

class StaticBoard extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.handleClick(e);
    }

    render() {
        let nRows = [];
        for (let i = 0; i < this.props.boardSize; i++) {
            nRows.push(i);
        }

        if (this.props.boardOwner === this.props.thisPlayer) {
            return (
                <div className="board">
                    <span><mark>your ships</mark></span>
                    <HeaderRow rowLength={this.props.boardSize}/>
                    {
                        nRows.map((row) =>
                            <StaticRow
                                rowLength={this.props.boardSize}
                                key={row}
                                row={row + 1}
                                ships={this.props.ships}
                            />
                        )
                    }
                    <HeaderRow rowLength={this.props.boardSize}/>
                </div>
            )
        } else if (this.props.boardOwner === "shooting") {
            return (
                <div className="board">
                    <span><mark>your shooting board</mark></span>
                    <HeaderRow rowLength={this.props.boardSize}/>
                    {
                        nRows.map((row) =>
                            <StaticRow
                                rowLength={this.props.boardSize}
                                key={row}
                                row={row + 1}
                                shots={this.props.shots}
                                handleClick={this.handleClick}
                            />
                        )
                    }
                    <HeaderRow rowLength={this.props.boardSize}/>
                </div>
            )

        } else {
            return (
                <div className="board" >
                    <span><mark>shots at {this.props.boardOwner}</mark></span>
                    <HeaderRow rowLength={this.props.boardSize}/>
                    {
                        nRows.map((row) =>
                            <StaticRow
                                rowLength={this.props.boardSize}
                                key={row}
                                row={row + 1}
                                shots={this.props.shots}
                            />
                        )
                    }
                    <HeaderRow rowLength={this.props.boardSize}/>
                </div>
            )
        }
    }
}

class InputBoard extends React.Component {
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
            <div className="board">
                <span><mark>{this.props.player}</mark>'s board</span>
                <HeaderRow rowLength={this.props.boardSize}/>
                {
                    nRows.map((row) =>
                        <Row
                            rowLength={this.props.boardSize}
                            key={row}
                            row={row + 1}
                            ships={this.props.ships}
                            shots={this.props.shots}
                            handleInput={this.handleInput}
                        />
                    )
                }
                <HeaderRow rowLength={this.props.boardSize}/>
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
            <div className = "row">
                <HeaderCell label={this.props.row}/>
                {
                    nCol.map((col) =>
                        <Cell
                            key={col}
                            col={col}
                            row={this.props.row}
                            ships={this.props.ships}
                            shots={this.props.shots}
                            handleInput={this.handleInput}
                        />
                    )
                }
                <HeaderCell label={this.props.row}/>
            </div>
        )
    }
}

class StaticRow extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.handleClick(e);
    }

    render() {
        let nCol = [];
        for (let i = 0; i < this.props.rowLength; i++) {
            nCol.push(String.fromCharCode(i + 65))
        }

        return (
            <div className="row">
                <HeaderCell label={this.props.row}/>
                {
                    nCol.map((col) =>
                        <div
                            key={col}
                            col={col}
                            className="cell"
                            handleClick={this.handleClick}
                        >
                            {whatShipIsHere(col, this.props.row, this.props.ships)}
                        </div>
                    )
                }
                <HeaderCell label={this.props.row}/>
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
                <HeaderCell label=""/>
                {
                    nCol.map((col) =>
                        <HeaderCell
                            key={col}
                            label={col}
                        />
                    )
                } <HeaderCell label=""/>
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
                col={this.props.col}
                row={this.props.row}
                onChange={this.handleInput}
                className="cell"
                value={ship}
            />
        )
    }
}

class HeaderCell extends React.Component {
    render() {
        return (
            <p className="headerCell">{this.props.label}</p>
        )
    }
}

ReactDOM.render(<Game/>, root);

function errorsInConfigInput(config) {
    config.playerName = config.playerName.trim();
    config.gameId = config.gameId.trim();
    let errorMsg = "";
    let computerToHuman = {
        playerName: "player name",
        gameId: "game id",
        boardSize: "board size",
        numPlayers: "number of players"
    }
    let regx = /[^a-zA-Z0-9]/;

    for (let entry in config) {
        if (config[entry].length === 0) {
            errorMsg += `You didn't choose a ${computerToHuman[entry]}.\n`;
        } else if (config[entry].length > 20) {
            errorMsg += `Your ${computerToHuman[entry]} is greater than 20 characters.\n`;
        }

        if (regx.test(config[entry])) {
            errorMsg += `You can only use letters or numbers in ${computerToHuman[entry]}.\n`;
        }
    }

    if (!Number.isInteger(config.boardSize) || config.boardSize < 10 || config.boardSize > 20) {
        errorMsg += `You must enter a whole number between 10 and 20 for board size.\n`;
    }

    if (!Number.isInteger(config.numPlayers) || config.numPlayers < 2 || config.numPlayers > 4) {
        errorMsg += `You must enter a whole number between 2 and 4 for number of players.\n`;
    }

    if (errorMsg.length > 0) {
        errorMsg += "Try again.";
        alert(errorMsg);
        return true;
    } else {
        return false;
    };
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
        alert(
            `You can only place ${allShipsOfType.max} "${thisShip}"s and you've already placed ${allShipsOfType.max}.`
        )
        return false;
    }
    if (countOfThisShip === 0) return true;
    if (countOfThisShip === 1) return isAdjacent(thisShipLoc, allShipsOfType.locs)
    return (isAdjacent(thisShipLoc, allShipsOfType.locs) && isInLine(thisShipLoc, allShipsOfType.locs))
}

function howManyShipsOfThisType(type, allShips) {
    if (allShips[0] === 0) return 0;
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

    if (firstCToNumber - secondCToNumber === firstCellR - secondCellR) return "bd";
    if (firstCToNumber - secondCToNumber === -(firstCellR - secondCellR)) return "fd";
}

function newShipsWithoutThisLoc(c, r, ships) {
    let newShips = ships;
    for (let ship in ships) {
        for (let i = 0; i < ships[ship].locs.length; i++) {
            if (!ships[ship].locs[i]) continue;
            if (c === ships[ship].locs[i][0] && r === ships[ship].locs[i][1]) {
                newShips[ship].locs = [0];
                return newShips;
            }
        }
    }
}

function allShipsArePlaced(ships) {
    for (let e in ships) {
        if (!(ships[e].locs.length === ships[e].max)) {
            return false;
        }
    }
    return true;
}

function choosePlayerName(extraPrompt) {
    extraPrompt = extraPrompt ? (extraPrompt + "\n") : "";
    let playerName = prompt(extraPrompt + "Choose a player name (or enter your player name to log back in): ");
    let regx = /[^a-zA-Z0-9]/;
    while (regx.test(playerName)) {
        playerName = choosePlayerName("Name must contain only numbers and/or letters. ");
    }

    while (playerName.length > 20 || playerName.length === 0) {
        playerName = choosePlayerName("Name must be between 1 & 20 characters long. ");
    }

    return playerName;
}
