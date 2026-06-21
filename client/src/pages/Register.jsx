import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaLock } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

const TOTAL_STEPS = 3;

// Reusable animated wrapper for each step
function StepSlide({ children, direction, active }) {
  // direction: 'enter-right' | 'enter-left' | 'exit-right' | 'exit-left'
  return (
    <div
      data-direction={direction}
      data-active={active}
      className="step-slide"
    >
      {children}
    </div>
  );
}

function Register() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward');

  const [ username, setUsername ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ phone, setPhone ] = useState();
  const [ password, setPassword ] = useState('');
  const [ repeatedPassword, setRepeatedPassword ] = useState('');
  const [error, setError] = useState('');

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  let navigate = useNavigate();

  const goNext = () => {
    setError('');
    setDirection('forward');
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setError('');
    setDirection('backward');
    setStep((s) => s - 1);
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!username.trim()) return setError('Please enter a username.');
    if (!phone.trim()) return setError('Please enter a phone number.');
    goNext();
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    if (!email.trim()) return setError('Please enter an email.');
    goNext();
  };

  const handleStep3 = async (e) => {
    e.preventDefault();
    if (password !== repeatedPassword) return setError('Passwords do not match!');

    try {
      const res = await axios.post(`${SERVER_URL}/api/register`, {
        username,
        email,
        phone,
        password,
        isAdmin: false,
      });
      if (res.data.message === 'Registration Success!') navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please try again.');
    }
  };

  // Slide animation classes injected via a <style> tag
  const slideStyles = `
    .steps-container {
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    .step-slide {
      width: 100%;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
    }

    /* Forward: new page slides in from right */
    [data-direction="forward"][data-active="true"] {
      animation: slideInFromRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    /* Backward: new page slides in from left */
    [data-direction="backward"][data-active="true"] {
      animation: slideInFromLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes slideInFromRight {
      from { transform: translateX(60px); opacity: 0; }
      to   { transform: translateX(0);   opacity: 1; }
    }
    @keyframes slideInFromLeft {
      from { transform: translateX(-60px); opacity: 0; }
      to   { transform: translateX(0);     opacity: 1; }
    }
  `;

  return (
    <div className="h-screen pt-28 bg-[#f5f5ef]">
      <style>{slideStyles}</style>

      <div className="px-6 py-8 w-full max-w-sm mx-auto">
        <h1 className="text-2xl text-center font-bold mb-2">Create an Account</h1>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i + 1 <= step ? 'bg-[#545454] w-8' : 'bg-gray-300 w-4'
              }`}
            />
          ))}
        </div>

        {/* ── Step 1: Username & Phone ── */}
        {step === 1 && (
          <StepSlide direction={direction} active={true}>
            <form onSubmit={handleStep1} className="flex flex-col gap-4">
              <p className="text-sm text-gray-500 text-center mb-2">Let's start with your basic info</p>

              <div className="p-4 flex flex-row bg-[#eaeaea] border border-gray-300 rounded-3xl">
                <FaUser className="text-xl mx-2 text-gray-500 shrink-0" />
                <input
                  type="text"
                  className="bg-transparent w-full border-none outline-none"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="p-4 flex flex-row bg-[#eaeaea] border border-gray-300 rounded-3xl">
                <FaPhoneAlt className="text-xl mx-2 text-gray-500 shrink-0" />
                <input
                  type="tel"
                  className="bg-transparent w-full border-none outline-none"
                  placeholder="60123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-red-500 text-xs text-center">{error}</p>}

              <button
                type="submit"
                className="px-12 py-2 mt-4 bg-[#545454] text-white rounded-3xl w-full"
              >
                NEXT
              </button>
            </form>
          </StepSlide>
        )}

        {/* ── Step 2: Email ── */}
        {step === 2 && (
          <StepSlide direction={direction} active={true}>
            <form onSubmit={handleStep2} className="flex flex-col gap-4">
              <p className="text-sm text-gray-500 text-center mb-2">What's your email address?</p>

              <div className="p-4 flex flex-row bg-[#eaeaea] border border-gray-300 rounded-3xl">
                <MdEmail className="text-2xl mx-2 text-gray-500 shrink-0" />
                <input
                  type="email"
                  className="bg-transparent w-full border-none outline-none"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-red-500 text-xs text-center">{error}</p>}

              <button
                type="submit"
                className="px-12 py-2 mt-4 bg-[#545454] text-white rounded-3xl w-full"
              >
                NEXT
              </button>
              <button
                type="button"
                onClick={goBack}
                className="text-sm text-gray-500 hover:underline text-center"
              >
                ← Back
              </button>
            </form>
          </StepSlide>
        )}

        {/* ── Step 3: Password ── */}
        {step === 3 && (
          <StepSlide direction={direction} active={true}>
            <form onSubmit={handleStep3} className="flex flex-col gap-4">
              <p className="text-sm text-gray-500 text-center mb-2">Finally, secure your account</p>

              <div className="p-4 flex flex-row bg-[#eaeaea] border border-gray-300 rounded-3xl">
                <FaLock className="text-xl mx-2 text-gray-500 shrink-0" />
                <input
                  type="password"
                  className="bg-transparent w-full border-none outline-none"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="p-4 flex flex-row bg-[#eaeaea] border border-gray-300 rounded-3xl">
                <FaLock className="text-xl mx-2 text-gray-500 shrink-0" />
                <input
                  type="password"
                  className="bg-transparent w-full border-none outline-none"
                  placeholder="Confirm Password"
                  value={repeatedPassword}
                  onChange={(e) => setRepeatedPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-red-500 text-xs text-center">{error}</p>}

              <button
                type="submit"
                className="px-12 py-2 mt-4 bg-[#545454] text-white rounded-3xl w-full"
              >
                REGISTER
              </button>
              <button
                type="button"
                onClick={goBack}
                className="text-sm text-gray-500 hover:underline text-center"
              >
                ← Back
              </button>
            </form>
          </StepSlide>
        )}

        <Link to="/login">
          <p className="my-6 text-center text-xs hover:underline">Already a Member? Login</p>
        </Link>
      </div>
    </div>
  );
}

export default Register