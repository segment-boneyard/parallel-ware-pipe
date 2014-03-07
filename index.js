
/**
 * Expose `pipe`.
 */

module.exports = pipe;

/**
 * Returns a parallel ware plugin that waits until it has `keys`,
 * and then passes those keys into the last argument `fn`.
 *
 * @param {String..} keys
 * @param {Function} fn
 * @param {Object}
 */

function pipe () {
  var keys = [].slice.call(arguments);
  var fn = keys.pop();
  if (typeof fn !== 'function') throw new Error('Last argument to pipe must be a function');
  return { ready: ready.apply(null, keys), fn: plugin(keys, fn) };
}

/**
 * Returns a function that resolves the data `keys` and invokes
 * `fn` with those arguments.
 *
 * @param {Array|String} keys
 * @param {Function} fn
 * @return {Function}
 */

function plugin (keys, fn) {
  return function (data, callback) {
    var args = keys.map(function (key) { return find(data, key); });
    args.push(callback);
    fn.apply(fn, args);
  };
}

/**
 * Returns a ready function that waits on the data keys.. provided.
 *
 * @return {Function}
 */

function ready () {
  var keys = [].slice.call(arguments);
  return function (data) {
    return keys.reduce(function (memo, key) {
      return memo && find(data, key);
    }, true);
  };
}

/**
 * Dives into an object and resolves the proper key, with support
 * for period as deliminators.
 *
 * Note: replace with obj-case when I can actually get it from npm.
 *
 * @param {Object} data
 * @param {String} key
 * @return {?}
 */

function find (data, key) {
  var tokens = key.split('.');
  for (var i = 0; i < tokens.length; i += 1) {
    if (!data || typeof data !== 'object') return null;
    var token = ci(data, tokens[i]);
    if (token) data = data[token];
    else data = null;
  }
  return data;
}

/**
 * Return the proper casing of the `key`.
 *
 * @param {Object} obj
 * @param {String} key
 * @return {String}
 */

function ci (obj, key) {
  var lower = key.toLowerCase();
  var result = null;
  Object.keys(obj).forEach(function (k) {
    if (k.toLowerCase() === lower) result = k;
  });
  return result;
}