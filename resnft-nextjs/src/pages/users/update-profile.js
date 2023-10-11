import React from "react";
import { useState } from "react";
import { useAuthContext, useProfileContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import * as fcl from "@onflow/fcl";
import { setup } from "../../cadence/transactions/setup.js";

const UpdateProfile = () => {
  const { user, _ } = useAuthContext();
  const { profile, setProfile } = useProfileContext();
  const router = useRouter();

  const setupAccount = async () => {
    return await fcl.send([
      fcl.transaction(setup),
      fcl.args(),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(9999),
    ]);
  };

  const [formData, setFormData] = useState({
    userType: "customer",
    name: "",
    email: "",
    phone: "",
    location: "",
    menu: "",
    description: "",
    pubKey: "",
  });

  if (!user || !user.addr) {
    return (
      <div className="update-profile">
        <h2> Please Sign In to Update Your Profile </h2>
      </div>
    );
  } else {
    formData.pubKey = user.addr;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/users/update", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data.user);
      })
      .catch((error) => console.error(error));

    setupAccount()
      .then((res) => {
        return fcl.decode(res);
      })
      .then((res) => {
        console.log(res);
        fcl
          .tx(res)
          .onceSealed()
          .then(() => {
            router.push(`/users/${encodeURIComponent(user.addr)}`);
          });
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="update-profile">
      <div className="center-page-title">
        <h2> Update Your Profile </h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="Update-form">
          <div>
            <label htmlFor="userType">I am a: </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              className="Select-option"
            >
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>
          <div>
            <label htmlFor="name">Name:</label>
            <div className="short-answer">
              <input
                type="text"
                name="name"
                required
                minLength="1"
                maxLength="50"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {formData.userType === "restaurant" && (
            <>
              <div>
                <label htmlFor="menu">Menu:</label>
                <div className="short-answer">
                  <textarea
                    name="menu"
                    value={formData.menu}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="description">Description:</label>
                <div className="short-answer">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </>
          )}
          <div>
            <label htmlFor="location">Location:</label>
            <div className="short-answer">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <br />
          <div>
            <label htmlFor="email">Email:</label>
            <div className="short-answer">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="phone">Phone:</label>
            <div className="short-answer">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <br />
          <button type="submit" className="Gen-Button">
            UPDATE
          </button>
        </div>
      </form>{" "}
    </div>
  );
};

export default UpdateProfile;
