import React, {Component} from 'react';

export default class ConfigSelector extends React.Component {
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
