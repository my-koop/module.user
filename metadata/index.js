var utils = require("mykoop-utils");
var routes = require("./routes");
var translations = require("../locales/index");
var endpoints = require("./endpoints");

var metaData = new utils.MetaData();
routes.addRoutes(metaData);

metaData.addData("translations", translations);
metaData.addData("endpoints", endpoints);

var resMetaData = metaData.get();
module.exports = resMetaData;
