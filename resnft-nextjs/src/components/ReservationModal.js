import { useState } from "react";
import Modal from "react-modal";
import Link from "next/link";
import { DateTime } from "luxon";

export const ReservationModal = ({ reservation }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <button onClick={handleShow} className="Gen-Button button-inline-block">
        {DateTime.fromISO(reservation.datetime).toLocaleString(
          DateTime.TIME_SIMPLE
        )}
      </button>
      <Modal
        isOpen={showModal}
        onRequestClose={handleClose}
        contentLabel="Reservation Modal"
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
          <h3>
            Confirm reservation for:
            <br />
            nft.{reservation.nft}
            <br />
            {DateTime.fromISO(reservation.datetime).toLocaleString(
              DateTime.DATE_SIMPLE
            )}
            <br />
            {DateTime.fromISO(reservation.datetime).toLocaleString(
              DateTime.TIME_SIMPLE
            )}{" "}
          </h3>
          <br />

          <button className="Gen-Button">
            <Link
              href={`/restaurants/reservations/${encodeURIComponent(
                reservation.id
              )}`}
            >
              Book
            </Link>
          </button>
        </div>
      </Modal>
    </>
  );
};
