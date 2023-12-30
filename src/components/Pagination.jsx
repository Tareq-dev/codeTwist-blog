// Pagination.js


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const visiblePages = 5; // Number of visible page buttons

  const getVisiblePageNumbers = () => {
    if (totalPages <= visiblePages) {
      return pageNumbers;
    }

    const halfVisiblePages = Math.floor(visiblePages / 2);

    if (currentPage <= halfVisiblePages) {
      return pageNumbers.slice(0, visiblePages);
    }

    if (currentPage > totalPages - halfVisiblePages) {
      return pageNumbers.slice(-visiblePages);
    }

    const start = currentPage - halfVisiblePages - 1;
    const end = currentPage + halfVisiblePages;

    return pageNumbers.slice(start, end);
  };

  return (
    <div className="flex items-center justify-center my-20 select-none">
      <div className="bg-white rounded-md">
        <div className="flex gap-4 items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`cursor-pointer px-3 py-1 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
          >
            Prev
          </button>
          {getVisiblePageNumbers().map((page) => (
            <div
              key={page}
              onClick={() => onPageChange(page)}
              className={`cursor-pointer flex justify-center items-center rounded-full h-6 w-6  ${
                currentPage === page
                  ? "bg-black text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <div className="px-3 py-2">{page}</div>
            </div>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className={`cursor-pointer px-3  py-1 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
