import React, { useEffect } from "react";
import { useAuthContext, useProfileContext } from "@/contexts/AuthContext";
import * as fcl from "@onflow/fcl";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetchProfile } from "@/utils/utils";

function Navbar() {
  const { user, setUser } = useAuthContext();
  const { profile, setProfile } = useProfileContext();

  const router = useRouter();

  useEffect(() => {
    if (!(!user || !user.addr)) {
      fetchProfile({ addr: user.addr }).then((data) => {
        if (data) {
          setProfile(data.user);
        }
      });
      router.push(`/users/${encodeURIComponent(user.addr)}`);
    }
  }, [user]);

  return (
    <div className="nav">
      <div className="navbar">
        <div className="dropdown">
          <button className="dropbtn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              viewBox="0 96 960 960"
              width="48"
            >
              <path
                fill="currentColor"
                d="M115.935 822.696v-68.131h728.13v68.131h-728.13Zm0-212.631v-68.13h728.13v68.13h-728.13Zm0-212.63v-68.37h728.13v68.37h-728.13Z"
              />
            </svg>
            <i className="fa fa-caret-down"></i>
          </button>
          <div className="dropdown-content">
            <Link href="/home">Home</Link>
            <Link href="/restaurants/list-all">Discover Restaurants</Link>

            {user && user.addr ? (
              <>
                <Link href={`/users/${encodeURIComponent(user.addr)}`}>
                  Profile
                </Link>
                <Link href="/users/update-profile">Update Profile</Link>
                {/* <Link href="/mint">Mint NFT</Link> */}

                {profile && profile.isRestaurant ? (
                  <>
                    <Link
                      href={`/restaurants/allReservations/${encodeURIComponent(
                        user.addr
                      )}`}
                    >
                      Reservations
                    </Link>
                    <Link href="/restaurants/populate-reservations">
                      Populate Reservations
                    </Link>
                  </>
                ) : (
                  ""
                )}
              </>
            ) : (
              <Link href="/login">Login</Link>
            )}

            <Link href="/about">About</Link>
          </div>
        </div>
        {/* <div className="Nav-Btns">
          {!user || !user.addr ? (
            <>
              <button onClick={handleLogin} className="Nav-Button">
                <h2>Login</h2>
              </button>
            </>
          ) : (
            ""
          )}

          {user && user.addr ? (
            <>
              <button className="Nav-Button">
                <h2>
                  <Link href={`/users/${encodeURIComponent(user.addr)}`}>
                    Profile
                  </Link>
                </h2>
              </button>

              <button className="Nav-Button">
                <h2>
                  <Link href="/users/update-profile">Update Profile</Link>
                </h2>
              </button>

              <button onClick={logout} className="Nav-Button">
                <h2>Logout</h2>
              </button>
            </>
          ) : (
            ""
          )}
        </div> */}
        {/* <h1 className="SiteName"> Flow NFT </h1> */}
        <img src="/Logo.png" alt="logo" className="Nav-logo" />
      </div>
    </div>
  );
}

export default Navbar;
