"use strict";

var server = require("server");

/* Script Modules */
var BoltPreferences = require("~/cartridge/scripts/services/utils/preferences");

server.get("GetBoltConfig", server.middleware.https, function (req, res, next) {
  var configuration = BoltPreferences.getSitePreferences();

  res.setStatusCode(200);
  res.json({
    config: configuration,
    showtime: Date.now(),
  });
  next();
});

server.get(
  "GetDefaultShippingMethod",
  server.middleware.https,
  function (req, res, next) {
    var ShippingMgr = require("dw/order/ShippingMgr");
    var defaultMethod = ShippingMgr.getDefaultShippingMethod();

    res.setStatusCode(200);
    res.json({
      shipid: defaultMethod.ID,
    });
    next();
  }
);

module.exports = server.exports();
