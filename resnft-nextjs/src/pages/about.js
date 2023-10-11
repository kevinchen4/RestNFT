import React from "react";

const About = () => {
  return (
    <div className="About">
      <div className="Content">
        <div className="section">
          <p>
            ResNFT is a NFT minting and trading platform designed specifically
            for restaurant reservations. We created this platform for restaurants to 
            turn their deposit based reservations into reseleable and tradeable 
            NFTs. Now restaurants can make royalties as reservations change hands and 
            last minute reservation changes don't have to lead to a deposit loss for 
            customers.
          </p>
        </div>
        <div className="team-header">
          <h1>The Team</h1>
        </div>
        <div className="section-2">
          <div className="Member">
            <h3>Ari</h3>
            <p>Frontend lead, worked to make the flow of the app intuitive and understandable through overall organization, routing, and style.</p>
          </div>
          <div className="Member">
            <h3>Kevin</h3>
            <p>Backend lead, took the reigns in the creation of the minting and trading functions. Learned Cadence and the ins and outs of the Flow network.</p>
          </div>
          <div className="Member">
            <h3>Kat</h3>
            <p>Took the lead in the writing of the report and worked to support the team through organizing meetings and updates.</p>
          </div>
          <div className="Member">
            <h3>Tan</h3>
            <p>Led the team in the aspects of database creation, routing, and overall connection from backend to frontend. The project could not function without his efforts.</p>
          </div>
          <div className="Member"></div>
          <div className="Member"></div>
        </div>
      </div>
    </div>
  );
};

export default About;
