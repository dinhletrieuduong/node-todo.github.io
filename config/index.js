// Load user database
var configValues = require("./config.json");

module.exports = {
    getDbConnectionString: function () {
        return `mongodb://${configValues.username}:${configValues.password}@ds125841.mlab.com:25841/node-web-todos`;
    }
}