import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validate = () => {
    if (!validateEmail(emailRef.current.value)) {
      alert("Email is not valid!");
      emailRef.current.focus();
      emailRef.current.style.outlineColor = "red";
      return false;
    }
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const emailParts = emailRef.current.value.split("@");
    const username = emailParts[0]; // Extract username part from email

    const user = {
      username: username, // Use only the part before @ as username
      password: passwordRef.current.value,
    };

    axios
      .post("https://auth-rg69.onrender.com/api/auth/signin", user)
      .then(({ data }) => {
        if (
          data.message === "User Not found." ||
          data.message === "Invalid Password!"
        ) {
          alert(data.message);
        } else if (data.id) {
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("user", JSON.stringify(data));
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          alert(error.response.data.message || "An error occurred");
        } else {
          alert("An error occurred while trying to log in");
        }
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Login qilish
        </h2>
        <input
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
          ref={emailRef}
          type="email"
          placeholder="Emailingizni kiriting"
          autoComplete="email"
        />
        <input
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
          ref={passwordRef}
          type="password"
          placeholder="Parolingizni kiriting"
          autoComplete="current-password"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-500 transition-all duration-200 w-full font-semibold"
        >
          LOGIN
        </button>
        <Link
          to="/register"
          className="text-indigo-600 text-center mt-4 hover:underline transition-all duration-200"
        >
          Registerga o'tish
        </Link>
      </form>
    </div>
  );
};

export default Login;
