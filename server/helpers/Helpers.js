/**
 * Helpers
 * A Mix of Helper Functions 
 */


/**
 * @class Reply
 * @type {Object} 
 * @property {boolean}  success - Whether this is success data - Default: FALSE
 * @property {string}   message - String message to describe what happened
 * @property {string}   point   - String message to describe where this is called from | Default - Query
 * @property {Object}   data    - Data to Reply with 
 */
function Reply ({data, success, point}) { 
    return { success: success ?? false, message: `${(success ?? false) ? 'Succeeded' : 'Failed'} at ${point ?? 'Query'}`, data: data ?? null }; 
}

module.exports = {
    Reply
}