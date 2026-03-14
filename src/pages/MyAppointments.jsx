import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import Modal from "../Modal";
import { IoCloseSharp } from "react-icons/io5";
import toast from "react-hot-toast";


const MyAppointments = () => {
  const { appointments, setAppointments } = useContext(AppContext);
  const [modal, setModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const Shipping = 100;

  const handleCancel = (id) => {
    const updatedAppointments = appointments.filter((app) => app._id !== id);
    setAppointments(updatedAppointments);
  };

  const handlePayOnline = (appointment) => {
    setSelectedAppointment(appointment);
    setModal(true);
  };

const handlePayment = () => {
  if (!window.Razorpay) return toast.error("Razorpay SDK not loaded");

  if (!name || !address || !pincode || !phoneNumber)
    return toast.error("All fields are required");

  const grandTotal = 100 + (selectedAppointment?.fees || 0);

  const options = {
    key: "rzp_test_8qV1WhfU8MDfsP",
    amount: grandTotal * 100, // in paise
    currency: "INR",
    name: "Vivek Doctor Co.",
    description: "Appointment Payment",
    handler: function (response) {
      toast.success("Payment Successful");
      setModal(false);
    },
    prefill: {
      name,
      contact: phoneNumber,
    },
    theme: { color: "#3399cc" },
  };

  const rzp = new window.Razorpay(options);
  rzp.on("payment.failed", function (response) {
    toast.error(`Payment Failed: ${response.error.description}`);
  });
  rzp.open();
  console.log(window.Razorpay);
};
useEffect(() => {
  if (!window.Razorpay) {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }
}, []);



  return (
    <>
      {modal && (
  <Modal>
    <div className="fixed inset-0 bg-black-400  flex items-center justify-center z-50">
      <div className="bg-black rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-slideIn text-white">
        {/* Close Button */}
        <button
          onClick={() => setModal(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-800 transition"
        >
          <IoCloseSharp size={24} />
        </button>

        {/* Modal Content */}
        <h2 className="text-2xl font-semibold text-center mb-6 text-white">
          Payment Details
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-white mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-white mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-white mb-1">Pin Code</label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-white mb-1">Mobile Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  </Modal>
)}


      <div>
        <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
          My Appointments
        </p>

        {appointments.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No appointments booked yet.</p>
        )}

        {appointments.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_3fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
          >
            <div>
              <img className="w-32 bg-indigo-50" src={item.doctorImage} alt={item.doctorName} />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">{item.doctorName}</p>
              <p>{item.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Date & Time:</p>
              <p className="text-xs mt-1">
                {item.date} | {item.time}
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-end">
              <button
                onClick={() => handlePayOnline(item)}
                className="text-sm text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Pay Online
              </button>
              <button
                onClick={() => handleCancel(item._id)}
                className="text-sm text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MyAppointments;
