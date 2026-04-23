import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationNavProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const PaginationNav = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: PaginationNavProps) => {
  if (totalPages <= 1) return null;

  const buildPages = () => {
    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("ellipsis-start");
    }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("ellipsis-end");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col items-center mt-12 pb-8 space-y-4">
      <div className="text-sm text-gray-400">
        Page {currentPage} of {totalPages} &mdash; {totalItems} total items
      </div>

      <nav className="inline-flex items-center space-x-1 glass-card rounded-2xl p-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
            currentPage === 1
              ? "text-gray-500 cursor-not-allowed"
              : "text-gray-300 bg-gray-700/50 hover:bg-gray-600/70 hover:scale-[1.02]"
          }`}
        >
          <FaChevronLeft className="w-3 h-3 mr-2" />
          Previous
        </button>

        <div className="flex items-center space-x-1">
          {buildPages().map((page, idx) =>
            page === "ellipsis-start" || page === "ellipsis-end" ? (
              <span key={`${page}-${idx}`} className="px-2 text-gray-400">
                &hellip;
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  currentPage === page
                    ? "text-white bg-gradient-to-br from-red-700 to-red-900 shadow-[0_2px_8px_rgba(128,0,0,0.4)] border border-red-700/40"
                    : "text-gray-300 bg-gray-700/50 hover:bg-yellow-900/10 hover:text-yellow-400"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
            currentPage === totalPages
              ? "text-gray-500 cursor-not-allowed"
              : "text-gray-300 bg-gray-700/50 hover:bg-gray-600/70 hover:scale-[1.02]"
          }`}
        >
          Next
          <FaChevronRight className="w-3 h-3 ml-2" />
        </button>
      </nav>

      {totalPages > 10 && (
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-400">Go to page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) onPageChange(page);
            }}
            className="w-16 px-2 py-1 text-center bg-gray-800/50 border border-red-900/40 hover:border-red-800/60 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/70 focus:border-yellow-500/60 transition-all duration-200"
          />
          <span className="text-gray-400">of {totalPages}</span>
        </div>
      )}
    </div>
  );
};

export default PaginationNav;
