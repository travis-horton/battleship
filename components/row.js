import React, { Component } from "react";
import Cell from "./cell";

export default class Row extends React.Component {
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleInput(c, r, val) {
        this.props.handleInput(c, r, val);
    }

    handleClick(c, r) {
        this.props.handleClick(c, r);
    }

    render() {
        let className = "row";

        if (this.props.row === "header") {
            return (
                <div className={className}>
                    <Cell label=" "/>
                    {
                        this.props.cols.map((col) =>
                            <Cell label={col} key={col}/>
                        )
                    }
                    <Cell label=" "/>
                </div>

            )
        } else {
            return (
                <div className={className}>
                    <Cell label={this.props.row}/>
                    {
                        this.props.cols.map((col) =>
                            <Cell
                                boardStyle={this.props.boardStyle}
                                key={col}
                                col={col}
                                row={this.props.row}
                                ships={this.props.ships}
                                shots={this.props.shots}
                                handleInput={this.handleInput}
                                handleClick={this.handleClick}
                            />
                        )
                    }
                    <Cell label={this.props.row}/>
                </div>
            )
        }
    }
}
