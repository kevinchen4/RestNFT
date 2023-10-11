import "./App.css";
import react, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { getData } from "./cadence/scripts/getData.js";
import { setup } from "./cadence/transactions/setup.js";
import { mint } from "./cadence/transactions/mint.js";
import { sendflow } from "./cadence/transactions/sendflow.js";
import { getFlowBalance } from "./cadence/scripts/getFlowBalance.js";
import { createSale } from "./cadence/transactions/CreateSale.js";
import { purchase } from "./cadence/transactions/Purchase.js";
import { getSaleData } from "./cadence/scripts/getSaleIDs.js";
import { multimint } from "./cadence/transactions/multimint.js";

fcl
  .config()
  .put("app.detail.title", "NFT Dapp")
  .put("app.detail.icon", "https://i.imgur.com/9I6NRUm.png")
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");

function App() {
  const [user, setUser] = useState();
  const [totalSupply, setTotalSupply] = useState();
  const [myNFT, setMyNFT] = useState();
  const [mintBond, setMintBond] = useState(0);
  const [mintRoyalties, setMintRoyalties] = useState(0);
  const [mintName, setMintName] = useState("");
  const [mintData, setMintData] = useState("");
  const [flowBalance, setFlowBalance] = useState(0);
  const [flowSendAmount, setFlowsendamount] = useState(0);
  const [flowSendAddress, setFlowsendaddress] = useState("");
  const [saleNFTid, setSaleNFTid] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [buyNFTid, setBuyNFTid] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);
  const [buyaddr, setBuyaddr] = useState("");
  const [salequeryaddr, setSalequeryaddr] = useState("");

  const payload = {
    mintDatas: [
      "https://assets.pokemon.com/assets/cms2/img/pokedex/full/133.png",
      "https://assets.pokemon.com/assets/cms2/img/pokedex/full/197.png",
    ],
    mintBonds: [10, 20],
    mintRoyalties: [0.1, 0.2],
    mintNames: ["Eevee", "Umbreon"],
  };

  const multiplemint = async () => {
    const transactionID = await fcl
      .send([
        fcl.transaction(multimint),
        fcl.args([
          fcl.arg(payload.mintDatas, fcl.t.Array(fcl.t.String)),
          fcl.arg(payload.mintBonds, fcl.t.Array(fcl.t.UInt64)),
          fcl.arg(payload.mintRoyalties, fcl.t.Array(fcl.t.UFix64)),
          fcl.arg(payload.mintNames, fcl.t.Array(fcl.t.String)),
        ]),
        fcl.proposer(fcl.authz),
        fcl.payer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode);

    console.log(transactionID);
  };

  const login = () => {
    fcl.authenticate();
    fcl.currentUser().subscribe(setUser);
  };

  const logout = () => {
    fcl.unauthenticate();
    setUser(null);
  };

  const GetMyNFT = async () => {
    const response = await fcl.send([
      fcl.script(getData),
      fcl.args([fcl.arg(user.addr, fcl.t.Address)]),
    ]);
    const data = await fcl.decode(response);
    setMyNFT(data);
    console.log(data);
    console.log(myNFT);
    console.log(myNFT.type);
  };

  const createNFTsale = async () => {
    const transactionID = await fcl
      .send([
        fcl.transaction(createSale),
        fcl.args([
          fcl.arg(saleNFTid, fcl.t.UInt64),
          fcl.arg(salePrice, fcl.t.UFix64),
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode);

    console.log(transactionID);
  };

  const purchaseNFT = async () => {
    const transactionID = await fcl
      .send([
        fcl.transaction(purchase),
        fcl.args([
          fcl.arg(buyaddr, fcl.t.Address),
          fcl.arg(buyNFTid, fcl.t.UInt64),
          fcl.arg(buyPrice, fcl.t.UFix64),
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode);

    console.log(transactionID);
  };

  const mintNFT = async () => {
    const transactionID = await fcl
      .send([
        fcl.transaction(mint),
        fcl.args([
          fcl.arg(mintData, fcl.t.String),
          fcl.arg(mintBond, fcl.t.UInt64),
          fcl.arg(mintRoyalties, fcl.t.UFix64),
          fcl.arg(mintName, fcl.t.String),
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode);

    console.log(transactionID);
  };

  const sendflowtokens = async () => {
    const transactionID = await fcl
      .send([
        fcl.transaction(sendflow),
        fcl.args([
          fcl.arg(flowSendAddress, fcl.t.Address),
          fcl.arg(flowSendAmount, fcl.t.UFix64),
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode);

    console.log(transactionID);
  };

  const getFlowBalanceFunction = async () => {
    const response = await fcl.send([
      fcl.script(getFlowBalance),
      fcl.args([fcl.arg(user.addr, fcl.t.Address)]),
    ]);
    const data = await fcl.decode(response);
    setFlowBalance(data);
    console.log(data);
  };

  const getSaleDataFunction = async () => {
    const response = await fcl.send([
      fcl.script(getSaleData),
      fcl.args([fcl.arg(salequeryaddr, fcl.t.Address)]),
    ]);
    const data = await fcl.decode(response);
    console.log(data);
  };

  const setupAccount = async () => {
    const transactionID = await fcl
      .send([
        fcl.transaction(setup),
        fcl.args(),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode);
    console.log(transactionID);
  };
  return (
    <div className="App">
      <h1> Flow NFT </h1>
      <h2> Current Address : {user && user.addr ? user.addr : ""} </h2>
      <button onClick={login}> Login </button>
      <p> ----------------------</p>
      <button onClick={() => setupAccount()}> Setup </button>
      <p> ----------------------</p>
      <button onClick={() => getFlowBalanceFunction()}>
        {" "}
        Get Flow Balance{" "}
      </button>
      <p> Flow Balance : {flowBalance} </p>
      <p> ----------------------</p>
      <input
        type="text"
        placeholder="Enter Amount to Send"
        value={flowSendAmount}
        onChange={(e) => setFlowsendamount(e.target.value)}
      />
      <p></p>
      <input
        type="text"
        placeholder="Enter Address to Send"
        value={flowSendAddress}
        onChange={(e) => setFlowsendaddress(e.target.value)}
      />
      <p></p>
      <button onClick={() => sendflowtokens()}> Send Flow Tokens </button>
      <p> ----------------------</p>
      <p> ----------------------</p>
      <input
        type="text"
        placeholder="Enter Name for NFT"
        value={mintName}
        onChange={(e) => setMintName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Data for NFT"
        value={mintData}
        onChange={(e) => setMintData(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Bond for NFT"
        value={mintBond}
        onChange={(e) => setMintBond(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Royalties for NFT"
        value={mintRoyalties}
        onChange={(e) => setMintRoyalties(e.target.value)}
      />

      <br />
      <button onClick={() => mintNFT()}> Create NFT </button>
      <p> ----------------------</p>
      <button onClick={() => multiplemint()}> Create Multiple NFT </button>
      <p> ----------------------</p>

      <input
        type="text"
        placeholder="Enter NFT ID to Sell"
        value={saleNFTid}
        onChange={(e) => setSaleNFTid(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Price to Sell"
        value={salePrice}
        onChange={(e) => setSalePrice(e.target.value)}
      />
      <button onClick={() => createNFTsale()}> Create NFT Sale </button>

      <p> ----------------------</p>
      <input
        type="text"
        placeholder="Enter Address to Buy"
        value={buyaddr}
        onChange={(e) => setBuyaddr(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter NFT ID to Buy"
        value={buyNFTid}
        onChange={(e) => setBuyNFTid(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Price to Buy"
        value={buyPrice}
        onChange={(e) => setBuyPrice(e.target.value)}
      />
      <button onClick={() => purchaseNFT()}> Purchase NFT </button>

      <p> ----------------------</p>
      <input
        type="text"
        placeholder="Enter Address to Query"
        value={salequeryaddr}
        onChange={(e) => setSalequeryaddr(e.target.value)}
      />
      <button onClick={() => getSaleDataFunction()}> Get Sale Data </button>

      <p> ----------------------</p>
      <button onClick={() => GetMyNFT()}> Get NFT </button>
      <p> ----------------------</p>

      {myNFT
        ? myNFT.map((nft, index) => (
            <div key={index}>
              <img src={nft.Data} />
            </div>
          ))
        : ""}
      {myNFT ? myNFT.length : 0}
      <p> ----------------------</p>
    </div>
  );
}
/*
  return (
    <div className="App">
      <h1> Flow NFT </h1>
      <h2> Current Address : {user && user.addr ? user.addr : ""} </h2>
      <button onClick={login}> Login </button>
      <p> ----------------------</p>
      <button onClick={() => setupAccount()}> Setup </button>
      <p> ----------------------</p>
      <input
        type="text"
        placeholder="Enter Name for NFT"
        value={mintName}
        onChange={(e) => setMintName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Data for NFT"
        value={mintData}
        onChange={(e) => setMintData(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Bond for NFT"
        value={mintBond}
        onChange={(e) => setMintBond(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Royalties for NFT"
        value={mintRoyalties}
        onChange={(e) => setMintRoyalties(e.target.value)}
      />

      <br />
      <button onClick={() => mintNFT()}> Create NFT </button>

      <p> ----------------------</p>
      <button onClick={() => GetMyNFT()}> Get NFT </button>
      <p> ----------------------</p>

      {myNFT
        ? myNFT.map((nft, index) => (
            <div key={index}>
              <img src={nft.Data} />
            </div>
          ))
        : ""}
      {myNFT ? myNFT.length : 0}
      <p> ----------------------</p>
    </div>
  );
}
*/

export default App;
