import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { Spinner } from "flowbite-react";
import { useForgotPasswordMutation } from "../../redux/api/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your institutional email address.");
      return;
    }
    try {
      await forgotPassword({ email: trimmed }).unwrap();
      navigate(`/recovery-otp?email=${encodeURIComponent(trimmed)}`);
    } catch (err: any) {
      setError(err?.data?.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-950 py-10">
      <div className="flex flex-col items-center justify-center px-4 mx-auto w-full">
        <div className="w-full max-w-md glass-card rounded-2xl overflow-hidden">

          {/* Header band */}
          <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 px-8 py-6 text-center border-b border-yellow-600/20">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
              <FaLock className="w-5 h-5 text-yellow-400" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Forgot Password</h1>
            <p className="text-yellow-100/70 text-sm">
              Enter your institutional email and we'll send you a recovery code.
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-300">
                  Institutional Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    placeholder="name@iskolarngbayan.pup.edu.ph"
                    autoComplete="email"
                    className="w-full rounded-lg border bg-gray-800/50 px-4 py-3 pr-10 text-white placeholder:text-gray-400 backdrop-blur-sm border-red-900/40 hover:border-red-800/60 focus-visible:border-yellow-500/60 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-yellow-500/30"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <MdEmail className="w-4.5 h-4.5 text-gray-500" />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-400 text-center flex items-center justify-center gap-1.5" role="alert">
                  <span aria-hidden>✕</span> {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 border border-red-600/50 shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500/70"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" />
                    Sending recovery code…
                  </span>
                ) : "Send Recovery Code"}
              </button>

              <div className="pt-3 border-t border-gray-700/50 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-400 transition-colors duration-200"
                >
                  <FaArrowLeft className="w-3 h-3" />
                  Back to Login
                </Link>
              </div>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
