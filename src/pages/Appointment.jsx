import React, { useContext, useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { useNavigate } from "react-router-dom";


const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, bookAppointment } = useContext(AppContext);
  const navigate = useNavigate();


  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [date, setDate] = useState("");
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");


  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id == docId);

    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);


    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        timeSlots.push({
          dateTime: new Date(currentDate),
          time: formattedTime,
        });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlots(prev => [...prev, timeSlots]);
    }

  };
const handleBooking = () => {
  if (!slotTime) return;

  const selectedSlotIndex = docSlots[slotIndex].findIndex(
    (slot) => slot.time === slotTime
  );
  const selectedSlot = docSlots[slotIndex][selectedSlotIndex].dateTime;

  const appointmentData = {
    _id: Date.now(), // unique ID
    doctorId: docInfo._id,
    doctorName: docInfo.name,
    doctorImage: docInfo.image,
    speciality: docInfo.speciality,
    date: selectedSlot.toDateString(),
    time: slotTime,
    fees: docInfo.fees,
  };

  bookAppointment(appointmentData);
  navigate("/my-appointments");
};


  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    {
      getAvailableSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  return (
    docInfo && (
      <div>

        {/* ---Doctors Details------- */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt="Doctor"
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-end gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="Verified" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} = {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience} Years
              </button>
            </div>

            {/* -----Doctor About------ */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="Info" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* ---Booking Slots--- */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index
                    ? "bg-blue-700 text-white"
                    : "border border-gray-200"
                    }`}
                  key={index}
                >
                  <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                  <p>{item[0] && item[0].dateTime.getDate()}</p>
                </div>
              ))

            }
          </div>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime
                    ? "bg-blue-700 text-white"
                    : "text-gray-400 border border-gray-300"
                    }`}
                  key={index}
                >
                  {item.time?.toLowerCase()}
                </p>
              ))
            }
          </div>
          <button
            onClick={handleBooking} type="submit"
            className={`bg-blue-700 hover:bg-blue-800 text-white text-sm font-light px-14 py-3 rounded-full my-6 ${!slotTime ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            Book an Appointment
          </button>
        </div>

        {/* --Listing Related Doctors-- */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
