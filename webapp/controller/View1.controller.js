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
				
		onPhoneNumberChange: function() {
			const inputValue = this.byId("phoneInput").getValue();
			const regex = /^\+375(25|29|33|44|17)\s?\d{3}\s?\d{2}\s?\d{2}$/;
			const inputField = this.byId("phoneInput");
			let textErrorPassword = "";
			if (inputValue === "") {
				textErrorPassword = "Phone number must not be empty."
			}
			if (!regex.test(inputValue) && inputValue !== "") {
				textErrorPassword = "Enter phone number in correct format for Belarus"
			}
				if (textErrorPassword !== "") {
					inputField.setValueState(sap.ui.core.ValueState.Error);
					inputField.setValueStateText(textErrorPassword);
					return false;
			} else {
					inputField.setValueState(sap.ui.core.ValueState.None);
					return true;
			}
		},
		
		onPasswordChange: function () {
			const password = this.byId("passwordInput").getValue();
			const inputField = this.byId("passwordInput");
			let textErrorPassword = "";
			const specialChars = /[.,:;?!*+%\-<>$@${}\/\\_$#]/;
			if (!specialChars.test(password)) {
				textErrorPassword = "The password must contain at least one special character(.,:;?!*+%-<>$@${}/\_$#)";
			}
			if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
				textErrorPassword = "The password must contain at least one uppercase and one lowercase letter";
			}
			if (!/[0-9]/.test(password)) {
				textErrorPassword = "The password must contain at least one number";
			}
			if (password.length < 8 || password.length > 64) {
				textErrorPassword =
					"Password length must be from 8 to 64 characters";
			}
			if (textErrorPassword !== "") {
			  inputField.setValueState(sap.ui.core.ValueState.Error);
				inputField.setValueStateText(textErrorPassword);
				return false;
			} else {
				inputField.setValueState(sap.ui.core.ValueState.None);
				return true;
			}
		},
	
	    onConfirmPasswordChange: function() {
			const password = this.byId("passwordInput").getValue();
			const confirmPassword = this.byId("confirmPasswordInput").getValue();
			const confirmPasswordField = this.byId("confirmPasswordInput");
			if (password !== confirmPassword) {
					confirmPasswordField.setValueState(sap.ui.core.ValueState.Error);
				confirmPasswordField.setValueStateText("Passwords don't match.");
				return false;
			} else {
				confirmPasswordField.setValueState(sap.ui.core.ValueState.None);
				return true;
			}
	    },

			onSubmit: function () {
				var oView = this.getView(),
					aInputs = [
						oView.byId("nameInput"),
						oView.byId("lastNameInput"),
						oView.byId("emailInput"),
					],
					bValidationError = false;
				aInputs.forEach(function (oInput) {
					bValidationError = this._validateInput(oInput) || bValidationError;
				}, this);
				const bIsPhoneNumberValid = this.onPhoneNumberChange();
				const bIsPasswordValid = this.onPasswordChange();
				const bIsConfirmPasswordValid =  this.onConfirmPasswordChange();
				if (!bIsPhoneNumberValid && !bIsPasswordValid && !bIsConfirmPasswordValid) {
					bValidationError = true;
				}
				if (!bValidationError) {
					MessageToast.show("The input is validated. Your form has been submitted.");
				} else {
					MessageBox.alert("A validation error has occurred. Complete your input first.");
				}
		},
			
		onCancel: function () {
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