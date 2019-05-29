import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Transposit } from "transposit";

const transposit = new Transposit(
  "https://dopeee-52ajj.staging-transposit.com"
);

const Index: React.FC = () => {
  const [result, setResult] = useState(null);

  if (!transposit.isLoggedIn()) {
    window.location.href = "/signin";
    return null;
  }

  transposit
    .runOperation("untitled", {})
    .then(response => {
      if (response.status !== "SUCCESS") {
        throw response;
      }
      setResult(response.result.results![0]);
    })
    .catch(response => {
      console.log(response);
    });

  return (
    <div className="App">
      <header className="App-header">
        <button
          onClick={() => transposit.logOut(`${window.location.origin}/signin`)}
        >
          Sign out
        </button>
        {result && <h1>{result}</h1>}
      </header>
    </div>
  );
};

const Signin: React.FC = () => {
  const signInUri: string = transposit.startLoginUri(
    `${window.location.origin}/handle-signin`
  );

  return (
    <div className="App">
      <header className="App-header">
        <a href={signInUri}>Sign in</a>
      </header>
    </div>
  );
};

const HandleSignin: React.FC = () => {
  try {
    transposit.handleLogin(() => {
      window.location.href = "/";
    });
  } catch (err) {
    console.log(err);
    window.location.href = "/signin";
  }

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <Route path="/" exact component={Index} />
      <Route path="/signin" exact component={Signin} />
      <Route path="/handle-signin" exact component={HandleSignin} />
    </Router>
  );
};

export default App;
