import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const CLIENT_ID = "fd277b9307754f819cc13c4c29b995be";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const searchArtists = async (e) => {
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: "artist",
      },
    });
    setArtists(data.artists.items);
  };

  const renderArtists = () => {
    return artists.map((artist) => (
      <div className="artists-section">
        <span className="divider" />
        <div key={artist.id}>
          {artist.images.length ? (
            <img width={"80%"} src={artist.images[0].url} alt="" />
          ) : (
            <div>No Image</div>
          )}
          <div className="artist-name">{artist.name}</div>
        </div>
      </div>
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify Artist Finder</h1>
        {!token ? (
          <button id="login">
            <a
              href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
            >
              Login to Spotify
            </a>
          </button>
        ) : (
          <button id="logout" onClick={logout}>
            Logout
          </button>
        )}

        {token ? (
          <form className="search" onSubmit={searchArtists}>
            <input
              id="search-bar"
              type="text"
              placeholder="Find artists..."
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <button id="search-button" type={"submit"}>
              Search
            </button>
          </form>
        ) : (
          <div>
            <h2>Please log in</h2>

            <div class="dots-7"></div>
          </div>
        )}

        {renderArtists()}
      </header>
    </div>
  );
}

export default App;
