
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test')
  console.log('[INFO]', ...params);
};

const warn = (...params) => {
  if (process.env.NODE_ENV !== 'test')
  console.warn('[WARN]', ...params);
};

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test')
  console.error('[ERROR]', ...params);
};

module.exports = { info, warn, error};
