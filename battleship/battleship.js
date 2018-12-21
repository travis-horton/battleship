let doc = document;
let root = doc.getElementById('root');


let numColumns = 15;
let numRows = 15;
let data = [];
for (let i = 0; i < numColumns*numRows; i++) {
  data[i] = "";
}

let colHeaders = [];
for (let i = 0; i < numColumns; i++) {
	colHeaders.push(String.fromCharCode(i + 65));
}

class Cell extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleColor = this.handleColor.bind(this);
		this.state = { background: "" }
	}

	handleChange(e) {
		e.preventDefault();
		this.props.onChange(e.target.value, this.props.col, this.props.row);
	}

	handleColor(e) {
	}

	render() {
		let className = 'cell'
		let addedClass = addClass(this.props.col, this.props.row, this.state.background);
		className += addedClass;
		let self = this;
		let handleColor = function(e) {
			console.log(self.props.col, self.props.row);
		}
		return (
			<span>
				<input
					className={ className }
					type='text'
					onChange={ this.handleChange }
					contextMenu="colors"
				/>
				<menu type="context" id="colors">
					<menu label="colors">
						<menuitem label="blue" onClick={ handleColor }></menuitem>
						<menuitem label="black" onClick={ this.handleColor  }></menuitem>
						<menuitem label="red" onClick={ this.handleColor  }></menuitem>
					</menu>
				</menu>
			</span>
		)
	}
}

class HeaderCell extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let className='header'
		if (this.props.addClass) { className += this.props.addClass };
		return (
			<span className={ className }>{ this.props.children }</span>
		)
	}
}

function Row(props) {
	let cells = props.children;
	return (
		<div className="row">
			{ cells }
		</div>
	)
}


class Board extends React.Component {
	constructor(props) {
		super(props);
		let rows = props.cells.reduce(
			(rows, key, index) => (
				index % numColumns == 0 ? rows.push([key]) : rows[rows.length-1].push(key)
			) && rows, []);
		this.state = {
			cells: props.cells,
			colHeaders: props.colHeaders,
			rows: rows
		}
		this.updateCell = this.updateCell.bind(this);
	}

	updateCell(newValue, col, row) {
		console.log(newValue.toUpperCase());
		let i = row * numColumns + col;
		this.setState(function(state) {
			let newCells = this.state.cells.slice();
			newCells[i] = newValue.toUpperCase();
			return { cells: newCells }
		});
	}

	render() {
		return (
			<div className="board">
			<p className="boardName">{ this.props.boardName }</p>
				<Row className="header">
					<HeaderCell key="placeholder"/>
					{
						colHeaders.map(col =>
							<HeaderCell key={ col } addClass=' headerTop'>{ col }</HeaderCell>)
					}
				</Row>
				{
					this.state.rows.map((row, i) => (

						<Row key={ i + 1 }>
							<HeaderCell addClass=' headerLeft'>{ i + 1 }</HeaderCell>
							{
								row.map((cell, j) => (
									<Cell
										key={ i + " " + j }
										col={ j }
										row={ i }
										onChange={ this.updateCell }
										onSubmit={ console.log }
									>{ cell }</Cell>
								))
							}
							<HeaderCell addClass=' headerRight'>{ i + 1 }</HeaderCell>
						</Row>
					))
				}
				<Row className="header">
					<HeaderCell key="placeholder"/>
					{
						colHeaders.map(col =>
							<HeaderCell key={ col } addClass=' headerBottom'>{ col }</HeaderCell>)
					}
				</Row>
			</div>
		)
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div>
				<span>
					<Board cells={ data } colHeaders={ colHeaders } boardName='your board'/>
					<Board cells={ data } colHeaders={ colHeaders } boardName="player 2's board"/>
					<Board cells={ data } colHeaders={ colHeaders } boardName="player 3's board"/>
				</span>
				<ul>shots fired
					<li>round 1: </li>
				</ul>
			</div>
		)
	}
}

function addClass(col, row, color) {
	let classAddition = '';
	if (row === 0) classAddition += ' top';
	if (row === numRows - 1) classAddition += ' bottom';
	if (col === 0) classAddition += ' left';
	if (col === numColumns - 1) classAddition += ' right';
	classAddition += ` ${color}`

	return classAddition
}

ReactDOM.render(<Game/>, root)
