class BoardArea extends React.Component {
    constructor(props) {
        super(props);
        this.handleBoardInput = this.handleBoardInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleShoot = this.handleShoot.bind(this);
    }

    handleBoardInput(c, r, val) {
        this.props.handleInput(c, r, val);
    }

    handleSubmit(e) {
        this.props.handleSubmit(e);
    }

    handleClick(c, r) {
        this.props.handleClick(c, r);
    }

    handleShoot(e) {
        e.preventDefault();
        this.props.handleShoot();
    }

    render() {
        if (!this.props.thisPlayer.shipsCommitted) {
            return (
                <div className="right_column">
                    <Board
                        boardSize={this.props.boardSize}
                        boardStyle="input"
                        handleInput={this.handleBoardInput}
                        boardOwner={this.props.thisPlayer.name}
                        shots={this.props.shots}
                        ships={this.props.ships}
                        thisPlayer={this.props.thisPlayer.name}
                    />
                    <br/>
                    <button onClick={this.handleSubmit}>Submit ship placement</button>
                </div>
            )
        } else {
            let players = this.props.players;
            let shots = this.props.shots;

            return (
                <div className="board_area">
                    <Board
                        boardSize={this.props.boardSize}
                        boardOwner={"shooting"}
                        shots={this.props.shots}
                        thisPlayer={this.props.thisPlayer.name}
                        handleClick={this.handleClick}
                    />
                    <button onClick={this.handleShoot}>Fire ze missiles!</button>
                    {
                        players.map((boardOwner) =>
                            <Board
                                key={boardOwner}
                                boardSize={this.props.boardSize}
                                boardOwner={boardOwner}
                                ships={this.props.ships}
                                shots={this.props.shots}
                                thisPlayer={this.props.thisPlayer.name}
                            />
                        )
                    }
                    <Board
                        boardSize={this.props.boardSize}
                        boardOwner={this.props.thisPlayer.name}
                        ships={this.props.ships}
                        shots={this.props.shots}
                        thisPlayer={this.props.thisPlayer.name}
                    />
                </div>
            )
        }
    }
}
