import prisma from "../../../../prisma/lib/prisma";
import React, { useState } from "react";
import { DateTime } from "luxon";
import { ReservationModal } from "@/components/ReservationModal";


const UserProfile = ({ reservations }) => {
  const [searchDate, setSearchDate] = useState("");
  const [searchTime, setSearchTime] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  const handleDateChange = (event) => {
    setSearchDate(event.target.value);
    // Update available time slots based on selected date and time
    updateAvailableTimeSlots(event.target.value, searchTime);
  };

  const handleTimeChange = (event) => {
    setSearchTime(event.target.value);
    // Update available time slots based on selected date and time
    updateAvailableTimeSlots(searchDate, event.target.value);
  };

  const updateAvailableTimeSlots = (date, time) => {
    let selectedTime = new Date(`${date}T${time}:00`);
    selectedTime = DateTime.fromJSDate(selectedTime);

    // Filter reservations to find available time slots for selected date and time
    const availableSlots = reservations.filter((reservation) => {
      const reservationDateTime = DateTime.fromISO(reservation.datetime);
      return reservationDateTime >= selectedTime;
    });

    const reservationByDate = availableSlots.reduce((acc, obj) => {
      const date = obj.datetime.split("T")[0];
      acc[date] = acc[date] || [];
      acc[date].push(obj);
      return acc;
    }, {});

    console.log(reservationByDate);

    setAvailableTimeSlots(reservationByDate);
  };

  return (
    <div>
      <div className="center-page-title">
        <h1>Reservation List</h1>
      </div>

      <div className="reservation-list-container">
        <form>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            min={DateTime.now().toISODate()}
            value={searchDate}
            onChange={handleDateChange}
          />
          <br />

          <label htmlFor="time">Time:</label>
          <input
            type="time"
            id="time"
            value={searchTime}
            onChange={handleTimeChange}
          />
        </form>

        <h2>Available Time Slots:</h2>

        <div className="reservation-list">
          {availableTimeSlots? (
            <>
              {Object.entries(availableTimeSlots).map(
                ([date, reservations]) => (
                  <div key={date}>
                    <h3>{date}</h3>
                    {reservations.map((reservation) => (
                       <ReservationModal reservation={reservation} />
                    ))}
                  </div>
                )
              )}
            </>
          ) : (
            <p>No available time slots for selected date and time.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

export async function getServerSideProps(context) {
  const publickey = context.params.publickey;

  const reservations = await prisma.reservation.findMany({
    where: {
      restaurantID: publickey,
      isAvailable: true,
    },
  });

  return {
    props: { reservations: reservations },
  };
}
