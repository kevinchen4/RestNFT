import prisma from "../../../../prisma/lib/prisma";
import { DateTime } from "luxon";

const calTimeDuration = (start, end) => {
  const _start = DateTime.fromISO(start);
  const _end = DateTime.fromISO(end);
  const duration = _end.diff(_start, "minutes").toObject().minutes;
  return duration;
};

const validate = (data) => {
  // some quick validation
  // assuming request sent by the form and not by someone intentionally trying to throw err
  const {
    period,
    openingTime,
    closingTime,
    reservationDuration,
    numTables,
    pubKey,
  } = data;

  if (
    !period ||
    !openingTime ||
    !closingTime ||
    !reservationDuration ||
    !numTables ||
    !pubKey
  ) {
    throw new Error("Missing required fields");
  }

  const openDuration = calTimeDuration(openingTime, closingTime);
  if (reservationDuration > openDuration) {
    throw new Error("Reservation duration cannot be longer than opening hours");
  }
  if (openDuration <= 0) {
    throw new Error("Open duration must be positive");
  }

  const numReservationsPerDay =
    Math.floor(openDuration / reservationDuration) * numTables;
  if (numReservationsPerDay > 600) {
    throw new Error("Too many reservations per day");
  }
};

const createReservations = (data) => {
  const {
    period,
    openingTime,
    closingTime,
    reservationDuration,
    numTables,
    miscInfo,
  } = data;

  let content = "Opening time: " + openingTime + "\n";
  content += "Closing time: " + closingTime + "\n";
  content += "Reservation duration: " + reservationDuration + "\n";
  content += "Other information: " + miscInfo + "\n";

  let periodInDays = period === "1 day" ? 1 : 7;
  const [startHour, startMinute] = openingTime.split(":");
  const [endHour, endMinute] = closingTime.split(":");

  const reservations = [];
  // loop through each day in the period
  for (let i = 0; i < periodInDays; i++) {
    const start_date = DateTime.now()
      .plus({ days: i })
      .set({ hour: parseInt(startHour), minute: parseInt(startMinute) });

    const end_date = DateTime.now()
      .plus({ days: i })
      .set({ hour: parseInt(endHour), minute: parseInt(endMinute) });

    // loop through each time slot for the day
    for (
      let j = start_date;
      j < end_date;
      j = j.plus({ minutes: reservationDuration })
    ) {
      // create a reservation for each table
      for (let k = 0; k < numTables; k++) {
        reservations.push({
          datetime: j.toISO(),
          content: content,
        });
      }
    }
  }

  return reservations;
};

export default async function handler(req, res) {
  const method = req.method;

  if (method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log(req.body);

  // Data validation
  try {
    validate(req.body);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  // Create reservations data
  const reservationDataList = createReservations(req.body);

  let reservationsCreated = [];

  for (const reservationData of reservationDataList) {
    const newReservation = await prisma.reservation.create({
      data: {
        datetime: reservationData.datetime,
        content: reservationData.content,
        author: {
          connect: { pubKey: req.body.pubKey },
        },
      },
    });
    reservationsCreated.push(newReservation);
  }

  return res
    .status(200)
    .json({
      message: "Reservations created.",
      reservationsCreated: reservationsCreated,
    });
}
