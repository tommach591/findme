import React, { useCallback, useEffect, useState } from "react";
import oaklandZoo from "../../assets/oaklandZoo.json";
import "./App.css";

function App() {
  const GAMES = {
    oaklandZoo: oaklandZoo,
  };
  const [gameChoice, setGameChoice] = useState(() => {
    return localStorage.getItem("gameChoice") || Object.keys(GAMES)[0];
  });

  const [yourGame, setYourGame] = useState(() => {
    const saved = localStorage.getItem("yourGame");
    return saved ? JSON.parse(saved) : {};
  });

  const [list, setList] = useState(() => {
    const saved = localStorage.getItem("list");
    return saved ? JSON.parse(saved) : [];
  });

  const [done, setDone] = useState(() => {
    const saved = localStorage.getItem("done");
    return saved ? JSON.parse(saved) : false;
  });

  const randomizeGame = useCallback((obj) => {
    const entries = Object.entries(obj);
    for (let i = entries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [entries[i], entries[j]] = [entries[j], entries[i]];
    }
    const randomized = Object.fromEntries(entries.slice(0, 15));

    const newGame = {};
    Object.entries(randomized).forEach(([key, value]) => {
      newGame[key] = {
        description: value,
        guess: "-",
      };
    });

    setYourGame(newGame);
  }, []);

  useEffect(() => {
    localStorage.setItem("gameChoice", gameChoice);
  }, [gameChoice]);

  useEffect(() => {
    localStorage.setItem("yourGame", JSON.stringify(yourGame));
    console.log(yourGame);
  }, [yourGame]);

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  useEffect(() => {
    localStorage.setItem("done", JSON.stringify(done));
  }, [done]);

  return (
    <div className="App">
      <h1 className="Title">Find Me!</h1>
      <div className="Controls">
        <select
          className="SelectGame"
          value={gameChoice}
          onChange={(e) => {
            const value = e.currentTarget.value;
            setGameChoice(value);
          }}
        >
          {Object.keys(GAMES).map((name, i) => (
            <option value={name} key={i}>
              {name}
            </option>
          ))}
        </select>
        <button
          className="Reset"
          onClick={() => {
            randomizeGame(GAMES[gameChoice]);
            setList(["-", ...Object.keys(GAMES[gameChoice])]);
            setDone(false);
          }}
        >
          Reset Game
        </button>
      </div>
      <div className="Table">
        {Object.entries(yourGame).map(([k, v], i) => {
          return (
            <div className="Row" key={i}>
              {done ? (
                <img
                  className="Mark"
                  src={
                    k === v.guess
                      ? "https://api.iconify.design/carbon:thumbs-up-filled.svg?color=%2369e87e"
                      : "https://api.iconify.design/carbon:thumbs-down-filled.svg?color=%23f35959"
                  }
                  alt=""
                />
              ) : (
                <div />
              )}
              <h1 className="Description">{v.description}</h1>
              <select
                className="Answer"
                value={v.guess}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  setYourGame((prev) => ({
                    ...prev,
                    [k]: {
                      ...prev[k],
                      guess: value,
                    },
                  }));
                }}
              >
                {list.map((name, j) => (
                  <option value={name} key={j}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
      <button className="Check" onClick={() => setDone(true)}>
        Check
      </button>
    </div>
  );
}

export default App;
