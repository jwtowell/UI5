sap.ui.define([
	"PhoneSplit/controller/BaseController",
	"sap/m/MessageBox"
], function (BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("PhoneSplit.controller.Detail", {

		onInit: function () {
			var oRouter = this.getRouter();
			var oRoute = oRouter.getRoute("detail");
			
			oRoute.attachMatched(this._onRouteMatched, this);

		},
		
		onListDetailPressed : function(oEvent){
			var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();

			this._popup(oCtx.getProperty("Colour"));
			

		},
		
		_popup : function (Colour) {
			
			MessageBox.information("You have chosen:  " + Colour);
		},
		
		_onRouteMatched : function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

			oView.bindElement({
				path : "/Phones/" + oArgs.ID,
				//path :  oArgs.ID,
				events : {
					change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				}
			});
		},

		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		}

	});

});