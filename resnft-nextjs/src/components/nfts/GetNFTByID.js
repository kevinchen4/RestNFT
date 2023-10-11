import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { getData } from "../../cadence/scripts/getData.js";

// Placeholder rn. Not actually getting NFTs by ID
const GetNFTByID = ({ addr }) => {
  const [myNFT, setMyNFT] = useState();

  const GetNFT = async ({ addr }) => {
    const response = await fcl.send([
      fcl.script(getData),
      fcl.args([fcl.arg(addr, fcl.t.Address)]),
    ]);
    const data = await fcl.decode(response);
    setMyNFT(data);
    console.log(data);
    console.log(myNFT);
  };

  return (
    <div className="App">
      <h1>Get</h1>
      <input type="text" className="CreateInput" placeholder="Enter ID of NFT" />
      <button onClick={() => GetNFT({ addr })} className="Gen-Button">
        {" "}
        Get NFT{" "}
      </button>

      {myNFT
        ? myNFT.map((nft, index) => (
            <div key={index}>
              <img src={nft.Data} />
            </div>
          ))
        : ""}

      {myNFT ? myNFT.length : 0}
    </div>
  );
};

export default GetNFTByID;
