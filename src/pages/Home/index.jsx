import React, { useEffect, useState } from "react";
import { contract } from "../../configs";
import { Card } from "../../components";
import "./style.scss";

const Home = () => {
  const [manager, setManager] = useState("");

  const getManager = async () => {
    const managerAccount = await contract.methods.manager().call();

    setManager(managerAccount);
  };

  useEffect(() => {
    getManager();
  }, []);

  return (
    <>
      <div className="home-page-container">
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">Ethereum Lottery App</h1>
            <p className="page-subtitle">This contract is managed by:</p>
            <p className="page-subtitle">{manager}</p>
          </div>

          <Card manager={manager} />
        </div>
      </div>
    </>
  );
};

export default Home;
