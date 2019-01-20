import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: '',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.search = this.search.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  addTrack(track) {
    let ids = this.state.playlistTracks.map(ptrack => {
      return ptrack.id;
    })
    if (!ids.includes(track.id)) {
      let tracks = this.state.playlistTracks;
      tracks.push(track);
      this.setState({playlistTracks: tracks});
    } else {
      return false;
    }
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(item => {
      return item.id !== track.id;
    });
    this.setState({playlistTracks: tracks});
  }

  async search(term) {
    let searchResults = await Spotify.search(term);
    this.setState({searchResults: searchResults});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    const pName = this.state.playlistName;
    if (pName && trackURIs.length) {
      Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
        this.setState({
          playlistName: '',
          playlistTracks: []
        });
      });
    } else {      
      alert('You must provide a playlist name and some tracks!');
    }
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}
                           onAdd={this.addTrack} />
            <Playlist playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist} 
                      pName={this.state.playlistName}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
