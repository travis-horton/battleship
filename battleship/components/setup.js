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
