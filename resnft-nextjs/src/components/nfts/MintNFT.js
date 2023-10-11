import React from "react";
import react, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { mint } from "../../cadence/transactions/mint.js";

const MintNFT = () => {
  const [mintBond, setMintBond] = useState(0);
  const [mintRoyalties, setMintRoyalties] = useState(0);
  const [mintName, setMintName] = useState("");
  const [mintData, setMintData] = useState("");

  const authz = fcl.currentUser().authorization;

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
        fcl.payer(authz),
        fcl.proposer(authz),
        fcl.authorizations([authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode);

    console.log(transactionID);
  };

  return (
    <div className="App">
      <h1>Create NFT</h1>
      <input
        type="text"
        className="CreateInput"
        placeholder="Enter Name for NFT"
        value={mintName}
        onChange={(e) => setMintName(e.target.value)}
      />
      <input
        type="text"
        className="CreateInput"
        placeholder="Enter Data for NFT"
        value={mintData}
        onChange={(e) => setMintData(e.target.value)}
      />
      <input
        type="text"
        className="CreateInput"
        placeholder="Enter Bond for NFT"
        value={mintBond}
        onChange={(e) => setMintBond(e.target.value)}
      />
      <input
        type="text"
        className="CreateInput"
        placeholder="Enter Royalties for NFT"
        value={mintRoyalties}
        onChange={(e) => setMintRoyalties(e.target.value)}
      />

      <br />
      <button onClick={() => mintNFT({ authz })} className="Create-Button">
        {" "}
        Create NFT{" "}
      </button>
    </div>
  );
};

export default MintNFT;
