// components/common/Pagination.jsx
import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  indexOfFirstItem, 
  indexOfLastItem,
  onPageChange,
  itemName = 'items',
  maxVisiblePages = 5
}) => {
  const getPageNumbers = () => {
    const pages = [];
    
    // if less than 5 then show all page
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      // calculate start and end of page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        startPage = 2;                                          // adjust if close to start, end = 4
        endPage = maxVisiblePages - 1;
      }
      
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - (maxVisiblePages - 2);         // adjust if close to end, end = total -1
        endPage = totalPages - 1;
      }
      
      if (startPage > 2) {                                      // add ... after first poage if many
        pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {              // add middle pages
        pages.push(i);
      }
      
      if (endPage < totalPages - 1) {                            // add ... before last page if many
        pages.push('...');
      }
      
      // last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
      <div className="text-sm text-gray-600">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} {itemName}
      </div>
      
      <div className="flex gap-2">
        {/* previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
          }`}
        >
          Previous
        </button>
        
        {/* page numbers */}
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-4 py-2 text-gray-500"
              >
                ...
              </span>
            );
          }
          
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === page
                  ? 'bg-[#E3E3E3] text-black border-[#E3E3E3]'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
            >
              {page}
            </button>
          );
        })}
        
        {/* next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;