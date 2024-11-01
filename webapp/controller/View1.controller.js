sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/SimpleType",
    "sap/ui/model/ValidateException",
    "sap/m/MessageBox",
    "sap/m/MessageStrip",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageToast",
		"sap/ui/core/Fragment",
  ],
  function (
    Controller,
    JSONModel,
    SimpleType,
    ValidateException,
    MessageBox,
    MessageStrip,
		BusyIndicator,
		MessageToast,
		Fragment,
  ) {
    "use strict";

		return Controller.extend("courseRegistrationPage.controller.View1", {
			onInit: function () {
				const oView = this.getView();
				const oModelReg = new JSONModel({
					submitEnabled: false,
				});
				oView.setModel(oModelReg, "modelReg");

				const oCityData = {
					CityCollection: [
						{ CityId: "1", City: "Minsk" },
						{ CityId: "2", City: "Grodno" },
						{ CityId: "3", City: "Brest" },
						{ CityId: "3", City: "Gomel" },
						{ CityId: "3", City: "Mogilev" },
						{ CityId: "3", City: "Vitebsk" },
					],
					selectedCity: "1",
				};
				const oModel = new JSONModel(oCityData);
				oView.setModel(oModel);

				this.oVerticalContent = this.byId("oVerticalContent");
				this.oPromocode = this.getView().byId("promocodeInput");

				const currentUrl = window.location.href;
				const url = new URL(currentUrl);
				const params = new URLSearchParams(url.search);
				const promocode = params.get("promocode");
				if (promocode) {
					this.oPromocode.setValue(promocode);
					this.oPromocode.setEnabled(false);
				} else {
					this.oPromocode.setEnabled(true);
				}
			},

			_validateName: function () {
				const oView = this.getView();
				let sValueState = "None";
				let bValidation = true;
				const oName = oView.byId("nameInput");
				const oBinding = oName.getBinding("value");
				try {
					oBinding.getType().validateValue(oName.getValue());
				} catch (oException) {
					sValueState = "Error";
					bValidation = false;
				}
				oName.setValueState(sValueState);
				return bValidation;
			},

			_validateLastName: function () {
				const oView = this.getView();
				let sValueState = "None";
				let bValidation = true;
				const oName = oView.byId("lastNameInput");
				const oBinding = oName.getBinding("value");
				try {
					oBinding.getType().validateValue(oName.getValue());
				} catch (oException) {
					sValueState = "Error";
					bValidation = false;
				}
				oName.setValueState(sValueState);
				return bValidation;
			},

			_validateEmail: function () {
				const oView = this.getView();
				let sValueState = "None";
				let bValidation = true;
				const oName = oView.byId("emailInput");
				const oBinding = oName.getBinding("value");
				try {
					oBinding.getType().validateValue(oName.getValue());
				} catch (oException) {
					sValueState = "Error";
					bValidation = false;
				}
				oName.setValueState(sValueState);
				return bValidation;
			},

			_validatePhoneNumber: function () {
				const inputValue = this.byId("phoneInput").getValue();
				const regex = /^\+375(25|29|33|44|17)\s?\d{3}\s?\d{2}\s?\d{2}$/;
				const inputField = this.byId("phoneInput");
				let textErrorPassword = "";
				if (inputValue === "") {
					textErrorPassword = "Phone number must not be empty.";
				}
				if (!regex.test(inputValue) && inputValue !== "") {
					textErrorPassword =
						"Enter phone number in correct format for Belarus";
				}
				if (textErrorPassword !== "") {
					inputField.setValueState("Error");
					inputField.setValueStateText(textErrorPassword);
					return false;
				} else {
					inputField.setValueState("None");
					return true;
				}
			},

			_validatePassword: function () {
				const password = this.byId("passwordInput").getValue();
				const inputField = this.byId("passwordInput");
				let textErrorPassword = "";
				const specialChars = /[.,:;?!*+%\-<>$@${}\/\\_$#]/;
				if (!specialChars.test(password)) {
					textErrorPassword =
						"The password must contain at least one special character(.,:;?!*+%-<>$@${}/_$#)";
				}
				if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
					textErrorPassword =
						"The password must contain at least one uppercase and one lowercase letter";
				}
				if (!/[0-9]/.test(password)) {
					textErrorPassword = "The password must contain at least one number";
				}
				if (password.length < 8 || password.length > 64) {
					textErrorPassword = "Password length must be from 8 to 64 characters";
				}
				if (textErrorPassword !== "") {
					inputField.setValueState("Error");
					inputField.setValueStateText(textErrorPassword);
					return false;
				} else {
					inputField.setValueState("None");
					return true;
				}
			},

			_validateConfirmPassword: function () {
				const password = this.byId("passwordInput").getValue();
				const confirmPassword = this.byId("confirmPasswordInput").getValue();
				const confirmPasswordField = this.byId("confirmPasswordInput");
				if (password !== confirmPassword) {
					confirmPasswordField.setValueState("Error");
					confirmPasswordField.setValueStateText("Passwords don't match.");
					return false;
				} else {
					confirmPasswordField.setValueState("None");
					return true;
				}
			},

			onCheckBoxSelect: function (oEvent) {
				const oView = this.getView();
				const bSelected = oEvent.getParameter("selected");
				if (bSelected) {
					oView.getModel("modelReg").setProperty("/submitEnabled", true);
				} else {
					oView.getModel("modelReg").setProperty("/submitEnabled", false);
				}
			},

			_validateForm() {
				let bValidation = false;
				const bIsNameValid = this._validateName();
				const bIsLastNameValid = this._validateLastName();
				const bIsEmailValid = this._validateEmail();
				const bIsPhoneNumberValid = this._validatePhoneNumber();
				const bIsPasswordValid = this._validatePassword();
				const bIsConfirmPasswordValid = this._validateConfirmPassword();
				if (
					bIsNameValid &&
					bIsLastNameValid &&
					bIsEmailValid &&
					bIsPhoneNumberValid &&
					bIsPasswordValid &&
					bIsConfirmPasswordValid
				) {
					bValidation = true;
				}
				return bValidation;
			},

			_delay: function (ms) {
				return new Promise((resolve) => setTimeout(resolve, ms));
			},

			_busyIndicator: function () {
				BusyIndicator.show();
				if (this._sTimeoutId) {
					clearTimeout(this._sTimeoutId);
					this._sTimeoutId = null;
				}
				this._sTimeoutId = setTimeout(
					function () {
						BusyIndicator.hide();
					}.bind(this),
					3000
				);
			},

			onSubmit: async function () {
				const bValidation = this._validateForm();
				if (bValidation) {
					this._busyIndicator();
					await this._delay(3000);
					this._showMsgStrip();
					this._resetForm();
				} else {
					this._scrollToErrorField();
					MessageBox.alert(
						"A validation error has occurred. Complete your input first."
					);
				}
			},

			_showMsgStrip: function () {
				if (this.MsgStrip !== undefined) {
					this.MsgStrip.destroy();
				}
				this._createMsgStrip();
			},

			_createMsgStrip: function () {
				const text = "Successfully registered!";
				const promocode = this.oPromocode.getValue();
				this._checkPromocode().then(
					(bIsValidPromocode) => {
						const textPromocode =
							bIsValidPromocode
								? `${text} Promocode ${promocode} successfully applied.`
								: `${text} Promocode ${promocode} not found.`;        
        this.MsgStrip = new MessageStrip({
						text: textPromocode,
						showCloseButton: true,
						showIcon: true,
						type: "Success",
					});
				this.oVerticalContent.addContent(this.MsgStrip);
			});
      },

      _scrollToErrorField: function () {
        const aAllInputs = this._getAllInput();
        const oFirstInvalidInput = aAllInputs.find(
          (input) => input.getValueState() === "Error"
        );
        oFirstInvalidInput.focus();
        oFirstInvalidInput
          .getDomRef()
          .scrollIntoView({ behavior: "smooth", block: "center" });
      },

      _getAllInput: function () {
        const oView = this.getView();
        const aAllInputs = [
          oView.byId("nameInput"),
          oView.byId("lastNameInput"),
          oView.byId("phoneInput"),
          oView.byId("emailInput"),
          oView.byId("passwordInput"),
					oView.byId("confirmPasswordInput"),
        ];
        return aAllInputs;
      },

      onCancel: function () {
        this._resetForm();
      },

      _resetForm: function () {
        const oView = this.getView();
        const aAllInputs = this._getAllInput();
        aAllInputs.forEach(function (oInput) {
          oInput.setValue(null);
          oInput.setValueState("None");
        }, this);
        oView.getModel("modelReg").setProperty("/submitEnabled", false);
				oView.byId("consentCheckbox").setSelected(false);
				if (this.oPromocode.getEnabled(true)) {
					this.oPromocode.setValue(null)
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
            throw new ValidateException(
              "'" + oValue + "' is not a valid e-mail address"
            );
          }
        },
      }),

      _checkPromocode: function () {
        return new Promise((resolve, reject) => {
          const sPromocode = this.oPromocode.getValue();
          jQuery.ajax({
            url: "https://www.vocabulary.com/word-of-the-day/",
            method: "GET",
            success: function (data) {
              var doc = new DOMParser().parseFromString(data, "text/html");
              var wordOfTheDay =
                doc.querySelector(".word-of-the-day").innerText;
              let bIsValidPromocode = "";
              if (sPromocode.toLowerCase() === wordOfTheDay.toLowerCase()) {
                bIsValidPromocode = true;
              } else {
                bIsValidPromocode = false;
              }
              resolve(bIsValidPromocode);
            },
            error: function (textStatus, errorThrown) {
              reject();
              console.error(
                "Error when receiving Word of the Day:",
                textStatus,
                errorThrown
              );
              console.error("Failed to obtain data to verify promo code.");
            },
          });
        });
			},

			_loadPopover: function (oEvent) {
				if (!this._oPopover) {
					Fragment.load({
						id: "myPopover",
						name: "courseRegistrationPage.view.fragment.LogoPopover",
						controller: this
					}).then(function (oPopover) {
						this._oPopover = oPopover;
						this.getView().addDependent(this._oPopover);
						this._oPopover.openBy(oEvent.getSource());
					}.bind(this));
				} else {
					this._oPopover.openBy(oEvent.getSource());
				}
			},
			
			onLogoPress: function (oEvent) {
				this._loadPopover(oEvent);
			},

			onButtonPress: function (oEvent) {
				MessageToast.show(oEvent.getSource().getText());
			}

    });
  }
);
