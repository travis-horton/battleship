import React from 'react';

class Dropdown extends React.Component {
  constructor(props){
    super(props);
  };

  showDropdownMenu(e) {
    e.preventDefault();
  }

  render() {
    return (
      this.props.showMenu ? (
        <div className="dropdown">
            <p>green</p>
            <p>blue</p>
            <p>black</p>
            <p>red</p>
        </div>
      ) : (
        null
      )
    );
  }
}

export default Dropdown;
