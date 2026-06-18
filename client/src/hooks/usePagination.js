import { useState } from 'react';

export const usePagination = (initialLimit = 25) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(() => {
    const savedLimit = localStorage.getItem('tms_defaultLimit');
    return savedLimit ? parseInt(savedLimit, 10) : initialLimit;
  });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = (newPage) => {
    setPage(Math.max(1, newPage));
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset back to first page
  };

  return {
    page,
    limit,
    total,
    totalPages,
    setPage,
    setLimit,
    setTotal,
    setTotalPages,
    handlePageChange,
    handleLimitChange
  };
};

export default usePagination;
