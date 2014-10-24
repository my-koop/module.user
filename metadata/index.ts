import utils = require("mykoop-utils");
import routes = require("./routes");
var translations = require("../locales/index");

var metaData = new utils.MetaData();
routes.addRoutes(metaData);

metaData.addData("translations", translations);

module.exports = metaData.get();
