'use strict';

/*
 * Creates custom log file for the cartridge
 */

/* API Includes */
var Logger = require('dw/system/Logger');

/* Constants */
var LogPrefix = 'bolt';

exports.getLogger = function (category) {
    if (category) {
        return Logger.getLogger(LogPrefix, category);
    }

    return Logger.getLogger(LogPrefix);
};