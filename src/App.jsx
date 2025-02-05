import { useState, useEffect } from 'react';
import './App.scss';
import searchImage from './Assets/search.png'; 


function App() {
  const [word, setWord] = useState("");  
  const [error, setError] = useState(null);
  const [meanings, setMeanings] = useState([]); 
  const [isSearching, setIsSearching] = useState(false); 
  const [searchTriggered, setSearchTriggered] = useState(false); 

  const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/`;

  // Function to handle search click (same as before)
  const handleSearchClick = () => {
    if (word.trim() === "") {
      setError("Please enter a word!"); 
      setMeanings([]); 
    } else {
      setSearchTriggered(true); 
      setIsSearching(true);
      setMeanings([]); 
      setError(null); 
    }
  };

  // Use effect to fetch the word meanings when searchTriggered changes
  useEffect(() => {
    if (searchTriggered && word) {
      fetch(`${apiUrl}${word}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Word not found!");
          }
          return response.json();
        })
        .then((data) => {
          const definitionsArray = data[0]?.meanings?.map((meaning) => meaning.definitions[0]?.definition) || [];
          setMeanings(definitionsArray);
          setIsSearching(false); 
        })
        .catch(() => {
          setError("Word not found!");
          setIsSearching(false); 
        });

      setSearchTriggered(false);
    }
  }, [searchTriggered, word, apiUrl]);

  const handleInputChange = (e) => {
    setWord(e.target.value);
    setError(null); 
    setMeanings([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick(); 
    }
  };

  return (
    <div className="App">
      <div className="page">
        <div className="main">
          <form className="form" onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
            <h1>Dictionary</h1>
            <div className="input">
            <input
              value={word}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}  // Trigger search when Enter is pressed
              placeholder="Search for a word"
              type="text"
            />
            <div className='button' onClick={handleSearchClick}>
             <img src={searchImage} alt="search"/>
            </div>
            </div>
          </form>

          <div className="right">
            {word.trim() === "" ? (
              <p>Please enter a word</p> 
            ) : (
              <>
                {error && <p>{error}</p>}
                {meanings.length > 0 && !error && (
                  <div>
                    <h3>Meanings of "{word}":</h3>
                    <ul>
                      {meanings.map((definition, index) => (
                        <li key={index}>{definition}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {isSearching && !error && <p>Searching...</p>}
                
                {!isSearching && meanings.length === 0 && !error && (
                  <p>Start typing to find word meanings.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
