import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";
import { Spinner } from "flowbite-react";
import { useVerifyRecoveryOtpMutation, useForgotPasswordMutation } from "../../redux/api/api";

const RESEND_COOLDOWN = 60;

const RecoveryOtp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyRecoveryOtp, { isLoading: isVerifying }] = useVerifyRecoveryOtpMutation();
  const [forgotPassword, { isLoading: isResending }] = useForgotPasswordMutation();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  useEffect(() => {
    if (!email) navigate("/forgot-password", { replace: true });
  }, [email, navigate]);

  const otp = digits.join("");

  const handleDigitChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = sanitized;
    setDigits(next);
    setError(null);
    if (sanitized && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...digits];
    pasted.split("").forEach((ch, i) => { if (i < 6) next[i] = ch; });
    setDigits(next);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (otp.length < 6) {
      setError("Please enter all 6 digits of your recovery code.");
      return;
    }
    setError(null);
    try {
      await verifyRecoveryOtp({ email, otp }).unwrap();
      navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
    } catch (err: any) {
      setError(err?.data?.message ?? "Verification failed. Please try again.");
      setDigits(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }, [otp, email, verifyRecoveryOtp, navigate]);

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setError(null);
    try {
      await forgotPassword({ email }).unwrap();
      setCooldown(RESEND_COOLDOWN);
      setDigits(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } catch (err: any) {
      setError(err?.data?.message ?? "Failed to resend code. Please try again.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl overflow-hidden">

          {/* Header band */}
          <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 px-8 py-6 text-center border-b border-yellow-600/20">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
              <FaEnvelope className="w-5 h-5 text-yellow-400" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Enter Recovery Code</h1>
            <p className="text-yellow-100/70 text-sm">
              We sent a 6-digit code to
            </p>
            <p className="text-yellow-400 font-semibold text-sm mt-0.5 truncate">
              {email}
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            <p className="text-gray-400 text-sm text-center mb-8 leading-relaxed">
              Enter the recovery code below. It expires in{" "}
              <span className="text-yellow-400 font-semibold">10 minutes</span>.
            </p>

            <form onSubmit={handleSubmit}>
              <div
                className="flex justify-center gap-3 mb-6"
                onPaste={handlePaste}
              >
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    aria-label={`Digit ${i + 1}`}
                    className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-gray-800/60 text-white outline-none transition-all duration-200 caret-transparent
                      ${error
                        ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.25)]"
                        : digit
                        ? "border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                        : "border-red-900/50 hover:border-red-800/70 focus:border-yellow-500 focus:shadow-[0_0_14px_rgba(234,179,8,0.3)]"
                      }`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center mb-4 flex items-center justify-center gap-1.5" role="alert">
                  <span aria-hidden>✕</span> {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifying || otp.length < 6}
                className="w-full py-3 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 border border-red-600/50 shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500/70"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" />
                    Verifying…
                  </span>
                ) : "Verify Code"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm mb-2">Didn't receive the code?</p>
              <button
                onClick={handleResend}
                disabled={cooldown > 0 || isResending}
                className="text-sm font-semibold text-yellow-500 hover:text-yellow-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : isResending
                  ? "Sending…"
                  : "Resend Code"}
              </button>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-700/50 text-center">
              <Link
                to="/forgot-password"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-400 transition-colors duration-200"
              >
                <FaArrowLeft className="w-3 h-3" />
                Back
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default RecoveryOtp;
