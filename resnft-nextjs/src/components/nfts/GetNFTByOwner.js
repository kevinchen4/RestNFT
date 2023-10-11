import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { getData } from "../../cadence/scripts/getData.js";
import { setReservationNFTs } from "@/utils/utils.js";
import Modal from "react-modal";

const NFTModal = ({ nft }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <button onClick={handleShow} className="Gen-Button button-inline-block">
      {nft.ID}
      </button>
      <Modal
        isOpen={showModal}
        onRequestClose={handleClose}
        contentLabel="NFT Modal"
        className="my-modal modal-window"
      >
        <div className="modal-content">
          <button onClick={handleClose} className="Close-Button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 96 960 960"
              width="20"
            >
              <path d="m251.333 866.406-61.739-61.739L418.26 576 189.594 347.333l61.739-61.739L480 514.26l228.667-228.666 61.739 61.739L541.74 576l228.666 228.667-61.739 61.739L480 637.74 251.333 866.406Z" />
            </svg>
          </button>
          <h3>NFT ID: {nft.ID}</h3>
          <h3>Restaurant: {nft.Creator}</h3>
          <h3>Reservation Information: <pre>{nft.Data}</pre></h3>

        </div>
      </Modal>
    </>
  );
};






// Placeholder rn. Not actually getting NFTs by ID
const GetNFTByOwner = ({ addr }) => {
  const [nfts, setNfts] = useState(null);

  useEffect(() => {
    console.log(addr);
    const fetchNFT = async ({ addr }) => {
      return await fcl
        .send([fcl.script(getData), fcl.args([fcl.arg(addr, fcl.t.Address)])])
        .then((response) => {
          return fcl.decode(response);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    if (addr) {
      fetchNFT({ addr }).then((data) => {
        setNfts(data);
        console.log(data);
      });
    }
  }, [addr]);

  useEffect(() => {
    if (nfts) {
      setReservationNFTs({ addr: addr, nfts: nfts }).then((data) => {
        if (data) {
          console.log(data);
        }
      });
    }
  }, [nfts]);

  return (
    <div className="reservation-list">
      Count: {nfts ? nfts.length : 0}
      <br />
      {nfts
        ? nfts.map((nft, index) => (
          <NFTModal key={index} nft={nft} />
          ))
        : ""}
    </div>
  );
};

export default GetNFTByOwner;
