import { createContext, useContext } from "react";
import { useState } from "react";

const NewReservationsContext = createContext();

export function NewReservationsWrapper({ children }) {
  const [reservationsCreated, setReservationsCreated] = useState();

  return (
    <NewReservationsContext.Provider
      value={{ reservationsCreated, setReservationsCreated }}
    >
      {children}
    </NewReservationsContext.Provider>
  );
}

export function useNewReservationsContext() {
  return useContext(NewReservationsContext);
}
