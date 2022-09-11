import React from "react";
import { web3 } from "./utils";
import "./App.scss";

const App = () => {
  web3.eth.getAccounts().then((result) => {
    console.log(result);
  });

  const getData = async () => {
    await window.ethereum.enable();
    const account = await web3.eth.getAccounts();

    console.log(account);
  };
  return (
    <>
      <div>
        <h1>Hello World!</h1>

        <button onClick={getData}>click me</button>
      </div>
    </>
  );
};

export default App;
