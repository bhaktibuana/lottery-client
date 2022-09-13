import { web3 } from "../utils";

const contract = {
  address: "0x13Df218B6e55906fcb79c71aBd33f5Afdd0C4Ee3",
  abi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
      signature: "constructor",
    },
    {
      inputs: [],
      name: "enter",
      outputs: [],
      stateMutability: "payable",
      type: "function",
      payable: true,
      signature: "0xe97dcb62",
    },
    {
      inputs: [],
      name: "getPlayers",
      outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
      stateMutability: "view",
      type: "function",
      constant: true,
      signature: "0x8b5b9ccc",
    },
    {
      inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
      name: "getWinnerInfo",
      outputs: [
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "address", name: "", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
      signature: "0x6b1da364",
    },
    {
      inputs: [],
      name: "getWinnerListLength",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
      constant: true,
      signature: "0x0831fb6c",
    },
    {
      inputs: [],
      name: "manager",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
      constant: true,
      signature: "0x481c6a75",
    },
    {
      inputs: [],
      name: "pickWinner",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
      signature: "0x5d495aea",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "players",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
      constant: true,
      signature: "0xf71d96cb",
    },
    {
      inputs: [],
      name: "setWinnerList",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
      signature: "0x21a9b5ab",
    },
  ],
};

export default new web3.eth.Contract(contract.abi, contract.address);
