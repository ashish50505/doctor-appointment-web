import { createContext, useState } from "react";
import { doctors } from "../assets/assets";

export const AppContext = createContext();

const AppContextProvider = (props) => {

  const currencySymbol = "$";

  const [appointments, setAppointments] = useState([]);
const bookAppointment = (data) => {
    setAppointments((prev) => [...prev, data]);
  };

  const value = {
    doctors,
    currencySymbol,
    appointments,
    bookAppointment,
    setAppointments
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
