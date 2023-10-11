import * as fcl from "@onflow/fcl";
import { getSaleData } from "@/cadence/scripts/getSaleIDs";

export const getAllRestaurants = () => {
  return fetch("/api/restaurants/get-all", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
};

export const fetchProfile = ({ addr }) => {
  return fetch("/api/users/get-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ addr: addr }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
};

export const setReservationNFTs = ({ addr, nfts }) => {
  return fetch("/api/restaurants/set-reservation-nft", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ addr: addr, nfts: nfts }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getSalePrice = async ({ addr, nftID }) => {
  fcl.currentUser().authorization;
  // Get price for this NFT from sale...
  console.log(addr);
  return await fcl
    .send([fcl.script(getSaleData), fcl.args([fcl.arg(addr, fcl.t.Address)])])
    .then(fcl.decode)
    .then((data) => {
      for (let sale in data) {
        if (sale === nftID) {
          return data[sale];
        }
      }
    });
};
