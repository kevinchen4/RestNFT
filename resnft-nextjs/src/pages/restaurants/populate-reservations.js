// Populating the database with available reservation times
import { useState, useEffect } from "react";
import { useAuthContext, useProfileContext } from "../../contexts/AuthContext";
import { useRouter } from "next/router";
import { useNewReservationsContext } from "@/contexts/CreateNewReservationsContext";

const RestaurantCreateManyReservations = () => {
  const router = useRouter();
  const { user, _ } = useAuthContext();
  const { profile, __ } = useProfileContext();

  const { reservationsCreated, setReservationsCreated } =
    useNewReservationsContext();

  const [formData, setFormData] = useState({
    period: "1 day",
    openingTime: "18:00",
    closingTime: "20:00",
    reservationDuration: "120",
    numTables: "2",
    miscInfo: "xdfsdajkdsfauiuiweqr",
    pubKey: "",
  });

  const [confirm, setConfirm] = useState(false);

  if (!user || !user.addr) {
    return (
      <div className="update-profile">
        <div className="Update-description">
          <h2> Please Sign In to Create Reservations</h2>
        </div>
      </div>
    );
  } else {
    if (profile.isRestaurant) {
      formData.pubKey = user.addr;
    } else {
      return (
        <div className="update-profile">
          <div className="Update-description">
            <h2> Only restaurants can create reservations.</h2>
          </div>
        </div>
      );
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirm) {
      fetch("/api/restaurants/populate-reservations", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setReservationsCreated(data.reservationsCreated);
        })
        .then(() => {
          router.push(`/restaurants/nfts-from-reservations`);
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div>
      <div className="Update-description">
        <p>Please enter the information on reservations you would like to create below:</p>
        <form onSubmit={handleSubmit}>
            <label htmlFor="period">Period (how many days of the week is this reservation?): </label>
            <select
              name="period"
              value={formData.period}
              onChange={handleInputChange}
              className="Select-option"
            >
              <option value="1 day">1 day</option>
              <option value="7 days">7 days</option>
            </select>
          <br/>
          <br/>
            <label htmlFor="openingTime">Opening Time: </label>
            <input
              type="time"
              name="openingTime"
              required
              value={formData.openingTime}
              onChange={handleInputChange}
            />
          <br/>
          <label htmlFor="closingTime">Closing Time: </label>
            <input
              type="time"
              name="closingTime"
              required
              value={formData.closingTime}
              onChange={handleInputChange}
            />

          <br />
            <label htmlFor="reservationDuration">Reservation Duration (in minutes): </label>
            <input
              type="number"
              name="reservationDuration"
              required
              value={formData.reservationDuration}
              onChange={handleInputChange}
            />
          <br />
          <label htmlFor="numTables">Number of Tables Available: </label>
            <input
              type="number"
              name="numTables"
              required
              value={formData.numTables}
              onChange={handleInputChange}
            />
          <br />
          <label>
            Other Information:
            <textarea
              name="miscInfo"
              value={formData.miscInfo}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={confirm}
              onChange={(e) => setConfirm(e.target.checked)}
            />
            Confirm mass creation of available reservations
          </label>
          <br />
          <button type="submit" disabled={!confirm}>
            Create Available Reservations
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantCreateManyReservations;

