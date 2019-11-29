import React, { Component } from "react";
import {whatShipIsHere, isShotAt} from "../modules/functions";

export default class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleInput(e) {
        e.preventDefault();
        this.props.handleInput(this.props.col, this.props.row, e.target.value.toLowerCase());
    }

    handleClick(e) {
        this.props.handleClick(this.props.col, this.props.row);
    }

    render() {
        let col = this.props.col;
        let row = this.props.row;
        let val = whatShipIsHere(col, row, this.props.ships);
        let className = "cell";

        if (this.props.shots && isShotAt(col, row, this.props.shots)) {
            className += " potentialshot"
        }
        if (row === 1) className += " toprow";
        if (col === "A") className += " leftcol";

        if (this.props.label) {
            className += " header";
            return (
                <span className={className}>{this.props.label}</span>
            )
        } else if (this.props.boardStyle === "input") {
            return (
                <input
                    onChange={this.handleInput}
                    className={className}
                    value={val}
                />
            )
        } else {
            return (
                <span
                    className={className}
                    onClick={this.handleClick}
                >{val}</span>
            )
        }
    }
}
