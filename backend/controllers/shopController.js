//shopControllers.js
module.exports = {
  ...require("./shop/shopAuthController"),
  ...require("./shop/shopManagementController"),
  ...require("./shop/shopInventoryController"),
  ...require("./shop/shopTransactionController"),
  ...require("./shop/shopDashboardController"),
};
