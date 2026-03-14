import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [allUser, setAllUser] = useState([]);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Load Users
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("allUser")) || [];
    setAllUser(users);
  }, []);

  // ------------------ SIGN UP HANDLER ------------------
  const signUpHandler = () => {
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    const exists = allUser.some((u) => u.email === email);
    if (exists) {
      toast.error("User already exists");
      return;
    }

    const newUser = { name, email, password };

    const updatedUsers = [...allUser, newUser];
    localStorage.setItem("allUser", JSON.stringify(updatedUsers));
    setAllUser(updatedUsers);

    toast.success("Account created! Please login.");

    // 🔥 IMPORTANT — clear fields
    setName("");
    setEmail("");
    setPassword("");

    setState("Login"); // switch to login page
  };


  // ------------------ LOGIN HANDLER ------------------
  const onSubmitHandler = (e) => {
    e.preventDefault();

    const isExistingUser = allUser.find(
      (it) => it.email === email && it.password === password
    );

    if (isExistingUser) {
      const { password, ...restData } = isExistingUser;
      localStorage.setItem("userDet", JSON.stringify(restData));

      toast.success("Login Successfully");
      navigate("/"); // WORKS NOW ✔
    } else {
      toast.error("Invalid Credentials");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-4 m-auto items-start p-8 w-[340px] sm:w-96 border rounded-2xl text-zinc-700 shadow-xl bg-white">

        <p className="text-3xl font-bold text-blue-700">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>

        {state === "Sign Up" && (
          <div className="w-full">
            <label className="text-sm font-medium">Full Name</label>
            <input
              className="border border-zinc-300 rounded-lg w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
        )}

        <div className="w-full">
          <label className="text-sm font-medium">Email</label>
          <input
            className="border border-zinc-300 rounded-lg w-full p-2 mt-1"
            type="email"
            
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className="w-full">
          <label className="text-sm font-medium">Password</label>
          <input
            className="border border-zinc-300 rounded-lg w-full p-2 mt-1"
            type="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        {/* BUTTONS */}
        {state === "Sign Up" ? (
          <button
            type="button"
            className="bg-blue-600 text-white w-full py-2 rounded-lg"
            onClick={signUpHandler}
          >
            Create Account
          </button>
        ) : (
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded-lg"
          >
            Login
          </button>
        )}

        {/* Toggle */}
        {state === "Sign Up" ? (
          <p className="text-sm">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-600 underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-sm">
            Create a new account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-600 underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
