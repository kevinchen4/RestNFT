import { createandsale } from "@/cadence/transactions/createandsale";
import { useEffect, useState } from "react";
import { useAuthContext, useProfileContext } from "../../contexts/AuthContext";
import { useRouter } from "next/router";
import { useNewReservationsContext } from "@/contexts/CreateNewReservationsContext";
import { setReservationNFTs } from "@/utils/utils";
import { getData } from "@/cadence/scripts/getData";
import * as fcl from "@onflow/fcl";
import { DateTime } from "luxon";

function transformArray(arr) {
  // Get all unique keys from the array of maps
  const keys = [...new Set(arr.flatMap((map) => Object.keys(map)))];

  // Map over the keys and create a new object for each key
  const result = keys.reduce((acc, key) => {
    acc[key] = arr.map((map) => map[key]);
    return acc;
  }, {});

  return result;
}

const NFTsFromReservations = () => {
  const router = useRouter();

  const { user, _ } = useAuthContext();

  const { reservationsCreated, setReservationsCreated } =
    useNewReservationsContext();

  const [mintBondArray, setMintBond] = useState();
  const [mintRoyaltiesArray, setMintRoyalties] = useState();
  const [priceArray, setSalePrice] = useState();

  if (!reservationsCreated) {
    return (
      <div className="update-profile">
        <h2> Please Create Reservations to Mint NFTs</h2>
      </div>
    );
  }

  const reservationsToMint = transformArray(reservationsCreated);

  const mintNameArray = reservationsToMint.id;
  const mintDataArray = reservationsToMint.content;

  function makeArray(elem, length) {
    return Array.from({ length }, () => elem);
  }

  const authz = fcl.currentUser().authorization;

  const mintAndCreateSale = async () => {
    await fcl // mint NFTs and create sale
      .send([
        fcl.transaction(createandsale),
        fcl.args([
          fcl.arg(mintDataArray, fcl.t.Array(fcl.t.String)),
          fcl.arg(mintBondArray, fcl.t.Array(fcl.t.UInt64)),
          fcl.arg(mintRoyaltiesArray, fcl.t.Array(fcl.t.UFix64)),
          fcl.arg(mintNameArray, fcl.t.Array(fcl.t.String)),
          fcl.arg(priceArray, fcl.t.Array(fcl.t.UFix64)),
        ]),
        fcl.payer(authz),
        fcl.proposer(authz),
        fcl.authorizations([authz]),
        fcl.limit(9999),
      ])
      .then((res) => {
        return fcl.decode(res);
      })
      .then((res) => {
        // Wait for transaction to be sealed
        console.log(res);
        fcl
          .tx(res)
          .onceSealed()
          .then(() => {
            // Get NFTs from user's account
            fcl
              .send([
                fcl.script(getData),
                fcl.args([fcl.arg(user.addr, fcl.t.Address)]),
              ])
              .then((response) => {
                return fcl.decode(response);
              })
              .then((data) => {
                // Connect to reservations in db
                setReservationNFTs({ addr: user.addr, nfts: data }).then(
                  (data) => {
                    if (data) {
                      console.log(data);
                    }
                  }
                );
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .then(() => {
            // Redirect to user's reservations
            router.push(
              `/restaurants/allReservations/${encodeURIComponent(user.addr)}`
            );
          });
      });
  };

  const handleMintBondChange = (e) => {
    const inputValue = parseInt(e.target.value);
    if (inputValue < 0) {
      alert("Mint Bond must be 0 or a positive whole number.");
    } else {
      // Cast to string
      let inputString = inputValue.toString();
      setMintBond(makeArray(inputString, mintNameArray.length));

      // Convert to uFix64 for price
      inputString = inputString.concat(".0");
      setSalePrice(makeArray(inputString, mintNameArray.length));
    }
  };

  const handleMintRoyaltiesChange = (e) => {
    const inputValue = parseFloat(e.target.value);
    if (inputValue < 0 || inputValue > 1) {
      alert("Mint Royalties must be between 0 and 1.");
    } else {
      let inputString = inputValue.toString();

      if (inputString.length == 1) {
        inputString = inputString.concat(".0");
      }

      setMintRoyalties(makeArray(inputString, mintNameArray.length));
    }
  };

  const reservationByDate = reservationsCreated.reduce((acc, obj) => {
    const date = obj.datetime.split("T")[0];
    acc[date] = acc[date] || [];
    acc[date].push(obj);
    return acc;
  }, {});

  console.log(reservationByDate);

  return (
    <div className="mint-and-create-sale">
      <div className="center-page-title">
      <h2> NFTs from Reservations </h2>
      </div>

      <div className="gen-text">
        <p>
          Following reservations created in database:
        </p>
      </div>

      <div className="reservation-list">
        {Object.entries(reservationByDate).map(([date, reservations]) => (
          <div key={date}>
            <h3>{date}</h3>
            {reservations.map((reservation) => (
              <button className="Gen-Button button-inline-block">
                {DateTime.fromISO(reservation.datetime).toLocaleString(
                  DateTime.TIME_SIMPLE
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="gen-text">
        <p>
          Fill out price for reservation NFTs and royalties ratio to mint and list reservation NFTs for sale.
        </p>
      </div>

      <div className="w-75 mint-form">
        <div>
          <label htmlFor="mintBond">NFT Price: </label>
          <input
            type="number"
            name="mintBond"
            step="1"
            placeholder="Set Price to Buy Reservation NFTs"
            onChange={(e) => handleMintBondChange(e)}
          />
        </div>

        <div>
        <label htmlFor="mintRoyalties">Royalty Ratio</label>
          <input
            type="number"
            name="mintRoyalties"
            step="0.01"
            min="0"
            max="1"
            placeholder="Set Mint Royalties"
            onChange={handleMintRoyaltiesChange}
          />
        </div>
        <div className="center">
          <button className="Gen-Button" onClick={() => mintAndCreateSale()}>
            {" "}
            Mint NFTs and Create Sale{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTsFromReservations;
