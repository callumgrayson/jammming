import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      term: ''
    };

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.selectAll = this.selectAll.bind(this);
  }

  handleTermChange(event) {
    this.setState({term: event.target.value});
  }

  selectAll() {
    let input = document.getElementsByClassName('input')[0];
    input.select();
  }

  search(e) {
    e.preventDefault();
    this.state.term && this.props.onSearch(this.state.term);
    this.selectAll();
  }

  render() {
    return (
      // <div className="SearchBar">
      <form className="SearchBar" onSubmit={this.search}>
        <input className="input" 
               placeholder="Enter A Song, Album, or Artist"
               onChange={this.handleTermChange}
               onFocus={this.selectAll}
        />
        <button onClick={this.search} >SEARCH</button>      
      </form>
      // </div>
    );
  }
}

export default SearchBar;
