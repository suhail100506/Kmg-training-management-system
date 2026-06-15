/**
 * Parses query options for pagination.
 */
const getPaginationOptions = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 25, 1), 100); // capped at 100
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Builds the pagination meta object for response serialization.
 */
const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages
  };
};

module.exports = { getPaginationOptions, getPaginationMeta };
