module.exports = function sortMiddleware(req, res, next) {
  res.locals._sort = {
    enabled: false,
    type: 'desc',
    column: 'createdAt',
  };

  if (Object.hasOwn(req.query, '_sort')) {
    const allowedColumns = ['name', 'price', 'stock', 'createdAt'];

    const { column, type } = req.query;

    if (allowedColumns.includes(column) && ['asc', 'desc'].includes(type)) {
      res.locals._sort = {
        enabled: true,
        column,
        type,
      };
    }
  }

  next();
};
