import react, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { sendflow } from "../cadence/transactions/sendflow.js";
import { getFlowBalance } from "../cadence/scripts/getFlowBalance.js";
import { createSale } from "../cadence/transactions/CreateSale.js";
import { purchase } from "../cadence/transactions/Purchase.js";
import { getSaleData } from "../cadence/scripts/getSaleIDs.js";
import { useAuthContext } from "@/contexts/AuthContext";

function Sale() {
  const { user, _ } = useAuthContext();

  const [flowBalance, setFlowBalance] = useState(0);
  const [flowSendAmount, setFlowsendamount] = useState(0);
  const [flowSendAddress, setFlowsendaddress] = useState("");
  const [saleNFTid, setSaleNFTid] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [buyNFTid, setBuyNFTid] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);
  const [buyaddr, setBuyaddr] = useState("");
  const [salequeryaddr, setSalequeryaddr] = useState("");

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

  return (
    <div className="Sale">
      <h1> Flow NFT </h1>
      <h2> Current Address : {user && user.addr ? user.addr : ""} </h2>
      <p> ----------------------</p>
      <p> ----------------------</p>
      <button onClick={() => getFlowBalanceFunction()}>
        {" "}
        Get Flow Balance{" "}
      </button>
      <p> Flow Balance : {flowBalance} </p>
      <p> ----------------------</p>
			<h1> Send Flow Tokens </h1>
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
			<h1>NFT Sale</h1>
      <input
        type="text"
        label="Enter NFT ID to Sell"
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
    </div>
  );
}

export default Sale;
