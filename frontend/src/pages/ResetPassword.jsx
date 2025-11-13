// 
//========================================================================
import { useState, useRef, useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const inputRef = useRef([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [otp, setOtp] = useState("");

  const { backendURL } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  // ✅ Handle OTP input change
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, ""); // only digits
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  // ✅ Handle backspace focus
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  // ✅ Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = paste.split("");
    setOtpValues(newOtp);

    newOtp.forEach((digit, i) => {
      if (inputRef.current[i]) {
        inputRef.current[i].value = digit;
      }
    });
  };

  // ✅ Step 1: Send Reset OTP
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backendURL}/send-reset-otp?email=${email}`);
      if (response.status === 200) {
        toast.success("Password reset OTP sent successfully.");
        setIsEmailSent(true);
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 2: Verify OTP
  const handleVerify = () => {
    const enteredOtp = otpValues.join("");
    if (enteredOtp.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP.");
      return;
    }

    setOtp(enteredOtp);
    setIsOtpSubmitted(true);
    toast.success("OTP verified successfully.");
  };

  // ✅ Step 3: Reset Password
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backendURL}/reset-password`, {
        email,
        otp,
        newPassword,
      });

      if (response.status === 200) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 position-relative"
      style={{ background: "linear-gradient(90deg, #6a5af9, #8268f9)", border: "none" }}
    >
      {/* Logo & Header */}
      <Link
        to="/"
        className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2 text-decoration-none"
      >
        <img src={assets.logo} alt="logo" height={32} width={32} />
        <span className="fs-4 fw-semibold text-light">Authify</span>
      </Link>

      {/* Step 1: Email Form */}
      {!isEmailSent && (
        <div className="rounded-4 p-5 text-center bg-white" style={{ width: "100%", maxWidth: "400px" }}>
          <h4 className="mb-2">Reset Password</h4>
          <p className="mb-4">Enter your registered email address</p>
          <form onSubmit={onSubmitEmail}>
            <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
              <span className="input-group-text bg-transparent border-0 ps-4">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control bg-transparent border-0 ps-1 pe-4 rounded-end"
                placeholder="Enter your email address"
                style={{ height: "50px" }}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <button className="btn btn-primary w-100 py-2" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: OTP Verification */}
      {isEmailSent && !isOtpSubmitted && (
        <div className="p-5 rounded-4 shadow bg-white" style={{ width: "400px" }}>
          <h4 className="text-center fw-bold mb-2">Email Verify OTP</h4>
          <p className="text-center mb-4">Enter the 6-digit code sent to your email.</p>

          <div className="d-flex justify-content-between gap-2 mb-4">
            {otpValues.map((val, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="form-control text-center fs-4 otp-input"
                ref={(el) => (inputRef.current[i] = el)}
                value={val}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
              />
            ))}
          </div>

          <button
            className="btn btn-primary w-100 fw-semibold"
            disabled={loading}
            onClick={handleVerify}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      )}

      {/* Step 3: New Password Form */}
      {isEmailSent && isOtpSubmitted && (
        <div className="rounded-4 p-4 text-center bg-white" style={{ width: "400px" }}>
          <h4>New Password</h4>
          <p className="mb-4">Enter your new password below</p>
          <form onSubmit={onSubmitNewPassword}>
            <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
              <span className="input-group-text bg-transparent border-0 ps-4">
                <i className="bi bi-person-fill-lock"></i>
              </span>
              <input
                type="password"
                className="form-control bg-transparent border-0 ps-1 pe-4 rounded-end"
                placeholder="********"
                style={{ height: "50px" }}
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
