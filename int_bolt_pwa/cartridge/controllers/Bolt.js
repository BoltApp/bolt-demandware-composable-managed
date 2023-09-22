"use strict";

var server = require("server");

/* API Includes */
var BasketMgr = require("dw/order/BasketMgr");

/* Script Modules */
var BoltPreferences = require("int_bolt_core/cartridge/scripts/services/utils/preferences");
var UserSignature = require("int_bolt_core/cartridge/scripts/cart/userSignature");
var commonUtils = require("int_bolt_core/cartridge/scripts/utils/commonUtils");

server.get(
  "GetCartSession",
  server.middleware.https,
  function (req, res, next) {
    var configuration = BoltPreferences.getSitePreferences();
    var hints, dwsid; // eslint-disable-line

    if (configuration && configuration.boltEnableCartPage) {
      dwsid = commonUtils.getDwsidCookie();
      hints = {};
      hints.fetch_cart_metadata = {
        SFCCSessionID: dwsid,
      };
    }

    res.setStatusCode(200);
    res.json({
      dwsid: dwsid,
      hints: hints,
    });
    next();
  }
);

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
  "GetDefaultShip",
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
