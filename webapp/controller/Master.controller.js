sap.ui.define([
	"PhoneSplit/controller/BaseController",
	"sap/ui/Device"
], function(BaseController, Device) {
	"use strict";

	return BaseController.extend("PhoneSplit.controller.Master", {

		onInit: function() {
			this.oList = this.byId("PhoneList");
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("detail").attachEvent("patternMatched", this.onDetailRouteHit.bind(this));
			this.oRouter.getRoute("main").attachEvent("patternMatched", this.onMasterRouteHit.bind(this));

			this.oRouter.attachEvent("bypassed", function() {
				this.oList.removeSelections(true);
			}.bind(this));
			var that = this;
			this.oListBindingPromise = new Promise(
				function(resolve, reject) {
					that.getView().addEventDelegate({
						onBeforeFirstShow: function() {
							that.oList.getBinding("items").attachEventOnce("dataReceived", function(oEvent) {
								if (oEvent.getParameter("data")) {
									resolve();
								} else {
									reject();
								}
							}, this);
						}.bind(that)
					});
				}
			);
		},

		onListItemPressed: function(oEvent) {
			var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();

			this.oRouter.navTo("detail", {
				ID: oCtx.getProperty("ID")
			});
		},

		onMasterRouteHit: function() {
			if (Device.system.phone) {
				return;
			}
			this.oListBindingPromise
				.then(function() {
			var oItems = this.oList.getItems();
			this.oList.setSelectedItem(oItems[0]);
			this.oRouter.navTo("detail", {
				ID: oItems[0].getBindingContext().getProperty("ID")
			});
				}.bind(this));
		},

		onDetailRouteHit: function(oEvent) {
			var sBusinessPartnerID = oEvent.getParameter("arguments").ID;
			var oSelectedItem = this.oList.getSelectedItem();
			if (oSelectedItem && oSelectedItem.getBindingContext().getProperty("ID") === sBusinessPartnerID) {
				return;
			} else {
					this.oListBindingPromise.then(function() {
				this.selectAnItem(sBusinessPartnerID);
					}.bind(this));
			}
		},

		onRefresh: function() {
			this.oList.getBinding("items").refresh();
		},

		selectAnItem: function(sBusinessPartnerID) {
			var sKey = this.getView().getModel().createKey("BusinessPartnerSet", {
				ID: sBusinessPartnerID
			});
			var oItems = this.oList.getItems();
			oItems.some(function(oItem) {
				if (oItem.getBindingContext() && oItem.getBindingContext().getPath() === "/" + sKey) {
					this.oList.setSelectedItem(oItem);
					return;
				}
			}, this);
		}
	});

});