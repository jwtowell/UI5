sap.ui.define([
	"PhoneSplit/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("PhoneSplit.controller.Main", {
		onInit : function () {
			
			var oRouter = this.getRouter();

			oRouter.attachBypassed(function (oEvent) {
				var sHash = oEvent.getParameter("hash");
				// do something here, i.e. send logging data to the backend for analysis
				// telling what resource the user tried to access...
				jQuery.sap.log.info("Sorry, but the hash '" + sHash + "' is invalid.", "The resource was not found.");
			});
		}
	});
});