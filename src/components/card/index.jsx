/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { web3 } from "../../utils";
import { contract } from "../../configs";
import { PulseLoader } from "react-spinners";
import "./style.scss";

const Card = (props) => {
  const { manager } = props;
  const [accounts, setAccounts] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [accountBalance, setAccountBalance] = useState(0);
  const [enterValue, setEnterValue] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [isEntering, setIsEntering] = useState(false);
  const [isCallingWinner, setIsCallingWinner] = useState(false);
  const [listOfWinners, setListOfWinners] = useState([]);
  const [lastWinner, setLastWinner] = useState("");
  const [listWinnerView, setListWinnerView] = useState();

  const handleConnectAccount = async () => {
    setIsConnecting(true);
    await window.ethereum.enable().catch((err) => {
      if (err) {
        setIsConnecting(false);
      }
    });

    const account = await web3.eth.getAccounts();

    setAccounts(account);
    setIsConnecting(false);
  };

  const fetchParticipants = async () => {
    await contract.methods
      .getPlayers()
      .call()
      .then((results) => {
        setParticipants(results);
      });

    await web3.eth.getBalance(contract.options.address).then((results) => {
      setContractBalance(results);
    });
  };

  const getBalance = async () => {
    const balance = await web3.eth.getBalance(accounts[0]);
    setAccountBalance(web3.utils.fromWei(balance, "ether"));
  };

  const handleEnterAmount = async () => {
    setIsEntering(true);

    if (accounts.length === 0) {
      alert("Please connect your wallet to join the lottery!");
      setEnterValue(0);
      setIsEntering(false);
    } else {
      if (parseFloat(enterValue) < 0.01) {
        alert("You must atleast enter 0.01 ether or more!");
        setEnterValue(0);
        setIsEntering(false);
      } else if (accounts[0] === manager) {
        alert("Manager cannot enter the lottery!");
        setEnterValue(0);
        setIsEntering(false);
      } else if (participants.includes(accounts[0])) {
        alert("You cannot enter the lottery more than once!");
        setEnterValue(0);
        setIsEntering(false);
      } else if (parseFloat(accountBalance) < parseFloat(enterValue)) {
        alert("Insufficient funds!");
        setEnterValue(0);
        setIsEntering(false);
      } else {
        await contract.methods
          .enter()
          .send({
            from: accounts[0],
            value: web3.utils.toWei(enterValue.toString(), "ether"),
          })
          .then((results) => {
            console.log(results);
            fetchParticipants();
            getBalance();
            alert("Congratulation, you have entered the lottery!");
            setEnterValue(0);
            setIsEntering(false);
          })
          .catch((error) => {
            console.log(error.message);
            alert(error.message);
            setEnterValue(0);
            setIsEntering(false);
          });
      }
    }
  };

  const fetchWinners = async () => {
    await contract.methods
      .getWinnerListLength()
      .call({
        from: manager,
      })
      .then(async (results) => {
        const length = results;
        const tempArr = [];

        for (let i = 0; i < length; i++) {
          await contract.methods
            .getWinnerInfo(i)
            .call({
              from: manager,
            })
            .then((results) => {
              tempArr.push(results);
            })
            .catch((error) => {
              console.log(error.message);
              alert(error.message);
              setIsCallingWinner(false);
            });
        }

        setListOfWinners(tempArr);
      })
      .catch((error) => {
        console.log(error.message);
        alert(error.message);
        setIsCallingWinner(false);
      });
  };

  const handleCallWinner = async () => {
    setIsCallingWinner(true);

    if (accounts[0] !== manager) {
      alert("Only manager can call a winner!");
      setIsCallingWinner(false);
    } else if (participants.length < 1) {
      alert("Cant call winner while no participants entered the lottery!");
      setIsCallingWinner(false);
    } else {
      await contract.methods
        .pickWinner()
        .send({
          from: manager,
        })
        .then(async () => {
          fetchParticipants();

          alert("Successfully picking a winner! Let's fetch the winner list.");

          await contract.methods
            .setWinnerList()
            .send({
              from: manager,
            })
            .then(async () => {
              await fetchWinners()
                .then(() => {
                  setIsCallingWinner(false);
                  getBalance();
                })
                .catch((error) => {
                  console.log(error.message);
                  alert(error.message);
                  setIsCallingWinner(false);
                });
            })
            .catch((error) => {
              console.log(error.message);
              alert(error.message);
              setIsCallingWinner(false);
            });
        })
        .catch((error) => {
          console.log(error.message);
          alert(error.message);
          setIsCallingWinner(false);
        });
    }
  };

  useEffect(() => {
    web3.eth.getAccounts().then((result) => {
      setAccounts(result);
    });

    fetchParticipants();

    fetchWinners();
  }, []);

  useEffect(() => {
    if (listOfWinners.length > 0) {
      const data = listOfWinners[listOfWinners.length - 1];
      setLastWinner(data[1]);

      setListWinnerView(
        listOfWinners.reverse().map((item, index) => {
          const date = new Date(item[0] * 1000);
          return (
            <div key={index} className="list">
              <p>
                • {`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}
              </p>
              <p>{item[1]}</p>
            </div>
          );
        })
      );
    }
  }, [listOfWinners]);

  useEffect(() => {
    if (accounts.length !== 0) {
      getBalance();
    }
  }, [accounts]);

  window.ethereum.on("accountsChanged", (accounts) => {
    web3.eth.getAccounts().then((result) => {
      setAccounts(result);
    });
  });

  return (
    <>
      <div className="card-container">
        <div className="card-header">
          <p className="title">Try your luck here</p>
          <p className="title">and win some Ether!</p>
        </div>

        <div className="card-body">
          <p className="card-desc">
            There are currently {participants.length} people entered, competing
            to win {web3.utils.fromWei(contractBalance.toString(), "ether")}{" "}
            ether!
          </p>

          <div className="connect-wallet">
            {accounts.length === 0 ? (
              <p>Connect your wallet and take your winning!</p>
            ) : (
              <p>
                You are connected, lets insert some ether to take your winning!
              </p>
            )}

            {accounts.length === 0 ? (
              <>
                <div className="connect">
                  <button
                    onClick={() => handleConnectAccount()}
                    disabled={isConnecting ? true : false}
                  >
                    Connect Wallet
                  </button>

                  {isConnecting && <PulseLoader size={8} margin={4} />}
                </div>
              </>
            ) : (
              <>
                <div className="account-details">
                  <p>Your address: {accounts[0]}</p>
                  <p>
                    Your balance: {parseFloat(accountBalance).toFixed(5)} ether
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="insert-amount-container">
            <p>Wanna try your luck?</p>

            <div className="insert-amount">
              <div className="amount-label">
                <p>Amount of ether</p>
              </div>

              <div className="amount-action">
                <input
                  type="number"
                  className="amount"
                  value={enterValue}
                  onChange={(e) => {
                    setEnterValue(e.target.value);
                  }}
                  disabled={isEntering ? true : false}
                />

                <button
                  onClick={() => handleEnterAmount()}
                  disabled={isEntering ? true : false}
                >
                  ENTER {isEntering && <PulseLoader size={3} />}
                </button>
              </div>
            </div>
          </div>

          <div className="rules-container">
            <p className="rules">Rules</p>
            <p>• Players can only enter once a week.</p>
            <p>• Manager cannot enter the lottery.</p>
            <p>• Winners will be announced every Monday.</p>
            <p>• The winner will get 80% of the total prize.</p>
            <p>
              • 20% of the total reward will be used for system development.
            </p>
            <p>
              • The list of players and total prizes will be reset after the
              winner is announced.
            </p>
          </div>

          {accounts[0] === manager && (
            <div className="call-winner-container">
              <button
                className="call-winner"
                onClick={() => handleCallWinner()}
                disabled={isCallingWinner ? true : false}
              >
                CALL WINNER {isCallingWinner && <PulseLoader size={3} />}
              </button>
            </div>
          )}

          <div className="winners-container">
            <p className="winners">Winners</p>

            <div className="last-winner">
              <p>Last winner: {lastWinner}</p>
            </div>

            <div className="list-winners">
              <p>List of winners:</p>

              {listWinnerView}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
