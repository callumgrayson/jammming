const clientId = '5360cac3dbb6475b8708940ae5f2f080';
const redirectUri = 'http://localhost:3000';

let accessToken;

// Functional component for interactions with API
const Spotify = {
  getAccessToken() {

    // If already a token return it
    if (accessToken) {
      return accessToken;
    }

    // Get token and expiry from URL if present
    let wlhref = window.location.href;
    let tempTokenMatch = wlhref.match(/access_token=([^&]*)/);
    let tempExpireMatch = wlhref.match(/expires_in=([^&]*)/);
    if (tempTokenMatch && tempExpireMatch) {

      // Assign values from URL
      accessToken = tempTokenMatch[1];
      const expiresIn = Number(tempExpireMatch[1]);
      console.log(expiresIn);

      // Set timeout and clear history
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');

      return accessToken;

    } else {

      // Send to Spotify to authorize
      const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = authorizeUrl;
      console.log(authorizeUrl);
    }
  },

  // Search returns a promise with data in object
  search(term) {
    const accessToken = Spotify.getAccessToken();

    // Send request to Spotify endpoint
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }

    // json the response
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {

      // If there is no data return an empty array
      if (!jsonResponse.tracks) {
        return [];
      }

      // If there is data iterate to get required fields
      let tempTracks = jsonResponse.tracks.items.map(item => ({
        id: item.id,
        name: item.name,
        artist: item.artists[0].name,
        album: item.album.name,
        uri: item.uri
      }));
      console.log(tempTracks);
      return tempTracks;
    });
  },

  savePlaylist(playlistName, trackURIs) {
    // If there is no name or no uris stop
    if (!playlistName || !trackURIs.length) {
      return;
    }

    // Get relevant data for injections
    const accessToken = Spotify.getAccessToken();
    let userId;
    const headers = {Authorization: `Bearer ${accessToken}` };

    // Send request to Spotify
    return fetch(`https://api.spotify.com/v1/me`, {
        headers: headers
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {

      // Data for injection
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({name: playlistName})

      // Response to json
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {

        // Data for injection
        const playlistID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({uris: trackURIs})
        });
      });
    });
  }
};

export default Spotify;
