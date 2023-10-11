import React from "react";
import * as fcl from "@onflow/fcl";
import { setup } from "../cadence/transactions/setup.js";
import MintNFT from "@/components/nfts/MintNFT.js";
import GetNFTByOwner from "@/components/nfts/GetNFTByOwner.js";
import { useAuthContext } from "@/contexts/AuthContext.js";
import Link from "next/link";

function Index() {
  const { user, _ } = useAuthContext();
  return (
    <div className="App">
      {user && user.addr ? (
        <div className="Home-wrapper">
          <div className="Home-content">
            <section className="Home-sec">
              <div className="Section-icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="148" viewBox="0 96 960 960" width="148"><path fill="currentColor" d="M645 934 496 784l50-49 99 99 213-213 51 49-264 264ZM396.796 561q-77.203 0-126-48.796Q222 463.407 222 386.204 222 309 270.796 260q48.797-49 126-49Q474 211 523.5 260T573 386.204q0 77.203-49.5 126Q474 561 396.796 561ZM548 642.684 401 794l139 140H52V813.269q0-40.269 21.672-75.18Q95.344 703.178 134 685q72-32 137.5-47T397 623q29 0 73 5.5t78 14.184Z"/></svg>
              </div>
              To get started register with us:
              <br/><br/>
              <button className="Gen-Button">
                <Link href="/users/update-profile">REGISTER</Link>
              </button>
            </section>
            <div className="Home-sec">
              <div className="Section-icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="148" viewBox="0 96 960 960" width="148"><path fill="currentColor" d="M189 1001q-39.05 0-66.525-27.475Q95 946.05 95 907V305q0-39.463 27.475-67.231Q149.95 210 189 210h56v-60h82v60h306v-60h82v60h56q39.463 0 67.231 27.769Q866 265.537 866 305v308h-95V486H189v421h310v94H189Zm729-206-95-95 29-29q13-13 33-13t33 13l29 29q14 14 13.5 33.5T947 766l-29 29Zm-359 264v-95l221-221 95 95-221 221h-95Z"/></svg>
              </div>
              Create new reservations:
              <br/><br/>
              <button className="Gen-Button">
                <Link href="/restaurants/populate-reservations">CREATE</Link>
              </button>
            </div>
            <div className="Home-sec">
              <div className="Section-icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="148" viewBox="0 96 960 960" width="148"><path fill="currentColor" d="M361 735q-17 0-28.5-11.428T321 695.25v-79.5q16 0 28-11.428T361 576q0-16.894-12-28.322t-28-11.428v-79.5q0-16.894 11.5-28.322T361 417h238q17 0 28.5 11.428T639 456.75v79.5q-16 0-28 11.428T599 576q0 16.894 12 28.322t28 11.428v79.5q0 16.894-11.5 28.322T599 735H361Zm119-60q8 0 14-5.5t6-14.5q0-8-6-13.5t-14-5.5q-8 0-14 5.5t-6 13.5q0 9 6 14.5t14 5.5Zm0-79q8 0 14-6t6-14q0-8-6-14t-14-6q-8 0-14 6t-6 14q0 8 6 14t14 6Zm0-80q8 0 14-5.5t6-13.5q0-9-6-14.5t-14-5.5q-8 0-14 5.5t-6 14.5q0 8 6 13.5t14 5.5Zm-209 523q-39 0-66.5-27.5T177 945V207q0-39 27.5-66.5T271 113h418q39 0 66.5 27.5T783 207v738q0 39-27.5 66.5T689 1039H271Zm0-184h418V297H271v558Z"/></svg>
              </div>
              View existing restaurants:
              <br/><br/>
              <button className="Gen-Button">
                <Link href="/restaurants/list-all">VIEW</Link>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <meta http-equiv="refresh" content="0; /login" />
          {/* <button className="Landing-Button">
            <Link href="/login">Login</Link>
          </button> */}
        </div>
      )}
    </div>
  );
}

export default Index;
