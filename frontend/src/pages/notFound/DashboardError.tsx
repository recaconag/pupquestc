import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { FaExclamationTriangle, FaArrowRight } from "react-icons/fa";

const DashboardError = () => {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : error instanceof Error
    ? error.message
    : "An unexpected error occurred";

  return (
    <div className="relative min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4 overflow-hidden">

      <div className="relative z-10 max-w-lg">

        {/* ICON */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
            <FaExclamationTriangle className="w-9 h-9 text-red-500/70" />
          </div>
        </div>

        {/* EYEBROW */}
        <div className="inline-flex items-center gap-2 mb-5">
          <div className="h-px w-6 bg-gradient-to-r from-transparent to-red-500/60" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-red-400/70">
            Dashboard Error
          </span>
          <div className="h-px w-6 bg-gradient-to-l from-transparent to-red-500/60" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gold-text mb-4 leading-tight">
          Something Went{" "}
          <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
            Wrong
          </span>
        </h1>

        <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-sm mx-auto font-light">
          {message}
        </p>

        <p className="text-gray-600 text-xs mb-10">
          Try refreshing the page. If the problem persists, contact your administrator.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-2.5 bg-red-800 hover:bg-red-700 text-white font-semibold text-sm py-3.5 px-7 rounded-xl shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/70 focus:ring-offset-2 focus:ring-offset-gray-950"
          >
            Back to Dashboard
            <FaArrowRight className="w-3.5 h-3.5 transition-transform duration-200" />
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="group inline-flex items-center gap-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm py-3.5 px-7 rounded-xl border border-white/10 hover:border-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/70 focus:ring-offset-2 focus:ring-offset-gray-950"
          >
            Retry
          </button>
        </div>

      </div>
    </div>
  );
};

export default DashboardError;
