sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/SimpleType",
	"sap/ui/model/ValidateException",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function( Controller, JSONModel, SimpleType, ValidateException, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("courseRegistrationPage.controller.View1", {
		onInit: function () {
			const oView = this.getView();
			oView.setModel(new JSONModel({
				busy: false,
				name: "",
				lastName: "",
				email: ""
			}));

			const oCityData = {
				CityCollection: [
						{ CityId: "1", City: "Minsk" },
						{ CityId: "2", City: "Grodno" },
						{ CityId: "3", City: "Brest" },
						{ CityId: "3", City: "Gomel" },
						{ CityId: "3", City: "Mogilev" },
						{ CityId: "3", City: "Vitebsk" }
				],
				selectedCity: "1"
			};

		  const oModel = new JSONModel(oCityData);
		  oView.setModel(oModel);
		},

			_validateInput: function (oInput) {
				var sValueState = "None";
				var bValidationError = false;
				var oBinding = oInput.getBinding("value");
				try {
					oBinding.getType().validateValue(oInput.getValue());
				} catch (oException) {
					sValueState = "Error";
					bValidationError = true;
				}
				oInput.setValueState(sValueState);
				return bValidationError;
			},

			onNameChange: function(oEvent) {
				var oInput = oEvent.getSource();
				this._validateInput(oInput);
			},

			onSubmit: function () {
				var oView = this.getView(),
					aInputs = [
						oView.byId("nameInput"),
						oView.byId("lastNameInput"),
						oView.byId("emailInput")
					],
					bValidationError = false;
				aInputs.forEach(function (oInput) {
					bValidationError = this._validateInput(oInput) || bValidationError;
				}, this);

				if (!bValidationError) {
					MessageToast.show("The input is validated. Your form has been submitted.");
				} else {
					MessageBox.alert("A validation error has occurred. Complete your input first.");
				}
			},

			customEMailType: SimpleType.extend("email", {
				formatValue: function (oValue) {
					return oValue;
				},

				parseValue: function (oValue) {
					return oValue;
				},

				validateValue: function (oValue) {
					const rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
					if (!oValue.match(rexMail)) {
						throw new ValidateException("'" + oValue + "' is not a valid e-mail address");
					}
				}
			})

	});
});