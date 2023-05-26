<template>
  <div class="container">
    <form>
      <div
        class="form-group"
        :class="{
          error:
            validationErrors.includes('Credit card number incorrect!') ||
            validationErrors.includes('Invalid credit card number!'),
          success:
            isValidationComplete &&
            !validationErrors.includes('Credit card number incorrect!') &&
            !validationErrors.includes('Invalid credit card number!'),
        }"
      >
        <label for="creditCardNumber">Credit Card Number:</label>
        <input
          type="text"
          id="creditCardNumber"
          v-model.trim="creditCardNumber"
          placeholder="Enter credit card number"
          @input="restrictCreditCardNumber"
        />
        <span
          v-if="
            validationErrors.includes('Credit card number incorrect!') ||
            validationErrors.includes('Invalid credit card number!')
          "
          class="validation-text"
        >
          {{
            validationErrors.includes("Credit card number incorrect!")
              ? "Credit card number incorrect!"
              : "Invalid credit card number!"
          }}
        </span>
      </div>

      <div class="form-pair">
        <div
          class="form-group"
          :class="{
            error:
              validationErrors.includes('Expiry month incorrect!') ||
              validationErrors.includes('Expiry date has already passed!'),
            success:
              isValidationComplete &&
              !validationErrors.includes('Expiry month incorrect!') &&
              !validationErrors.includes('Expiry date has already passed!'),
          }"
        >
          <label for="expiryMonth">Expiry Month:</label>
          <input
            type="text"
            id="expiryMonth"
            v-model.trim="expiryMonth"
            placeholder="Enter expiry month"
            @input="restrictExpiryMonth"
          />
          <span
            v-if="
              validationErrors.includes('Expiry month incorrect!') ||
              validationErrors.includes('Expiry date has already passed!')
            "
            class="validation-text"
          >
            {{
              validationErrors.includes("Expiry month incorrect!")
                ? "Expiry month incorrect!"
                : "Expiry date has already passed!"
            }}
          </span>
        </div>
        <div
          class="form-group"
          :class="{
            error:
              validationErrors.includes('Expiry year incorrect!') ||
              validationErrors.includes('Expiry date has already passed!'),
            success:
              isValidationComplete &&
              !validationErrors.includes('Expiry year incorrect!') &&
              !validationErrors.includes('Expiry date has already passed!'),
          }"
        >
          <label for="expiryYear">Expiry Year:</label>
          <input
            type="text"
            id="expiryYear"
            v-model.trim="expiryYear"
            placeholder="Enter expiry year"
            @input="restrictExpiryYear"
          />
          <span
            v-if="
              validationErrors.includes('Expiry year incorrect!') ||
              validationErrors.includes('Expiry date has already passed!')
            "
            class="validation-text"
          >
            {{
              validationErrors.includes("Expiry year incorrect!")
                ? "Expiry year incorrect!"
                : "Expiry date has already passed!"
            }}
          </span>
        </div>
      </div>

      <div
        class="form-group"
        :class="{
          error: validationErrors.includes('CVV incorrect!'),
          success:
            isValidationComplete &&
            !validationErrors.includes('CVV incorrect!') &&
            isValidationSuccess,
        }"
      >
        <label for="cvv">CVV:</label>
        <input
          type="text"
          id="cvv"
          v-model.trim="cvv"
          placeholder="Enter CVV"
          @input="restrictCVV"
        />
        <span
          v-if="validationErrors.includes('CVV incorrect!')"
          class="validation-text"
        >
          CVV incorrect!
        </span>
      </div>

      <button type="button" @click="submitForm" id="pay">Make payment</button>
    </form>

    <div v-if="showValidationResult" class="form-group">
      <span v-if="isValid" class="valid-icon" id="successful"
        >Payment Successful!</span
      >
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      creditCardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      showValidationResult: false,
      isValid: false,
      validationMessage: "",
      validationErrors: [],
    };
  },

  methods: {
    restrictCreditCardNumber() {
      this.creditCardNumber = this.creditCardNumber.replace(/[^0-9 ]/g, "");
    },
    restrictExpiryMonth() {
      this.expiryMonth = this.expiryMonth.replace(/\D/g, "");

      this.expiryMonth = this.expiryMonth.slice(0, 2);

      const month = parseInt(this.expiryMonth);
      if (month < 0 || month > 12) {
        this.expiryMonth = "";
      }
    },
    restrictExpiryYear() {
      this.expiryYear = this.expiryYear.replace(/\D/g, "");

      this.expiryYear = this.expiryYear.slice(0, 4);
    },
    restrictCVV() {
      this.cvv = this.cvv.replace(/\D/g, "");

      this.cvv = this.cvv.slice(0, 4);
    },
    async submitForm() {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/formdata",
          {
            creditCardNumber: this.creditCardNumber,
            expiryMonth: this.expiryMonth,
            expiryYear: this.expiryYear,
            cvv: this.cvv,
          }
        );

        this.isValid = response.data.isValid;
        this.showValidationResult = true;
        this.validationErrors = response.data.errors;

        this.isValidationSuccess =
          this.isValid && this.validationErrors.length === 0;
        this.isValidationComplete = true;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 75vh;
}

.container {
  width: 400px;
  min-height: 400px;
  border-radius: 1rem;
  background-color: white;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  padding: 40px;
  overflow: hidden;
}

h1 {
  font-size: 1.4rem;
  margin-bottom: 30px;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  min-width: 0;
}

.form-group > label {
  margin-bottom: 5px;
}

.form-group > input {
  border-radius: 0.375rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  line-height: 40px;
  padding: 0 10px;
  outline: none;
  font-size: 1rem;
  transition: ease 0.3s;
}

.form-group > input:focus {
  border-color: #07f;
  background: #0077ff05;
}

.form-pair {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  column-gap: 10px;
}

#pay {
  width: 100%;
  height: 50px;
  border-radius: 0.75rem;
  border: none;
  margin-top: 10px;
  color: white;
  background: #003fff;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
}

#cvv {
  border-radius: 0.375rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  line-height: 40px;
  padding: 0 10px;
  outline: none;
  font-size: 1rem;
  transition: ease 0.3s;
  width: 172px;
}

#successful {
  text-align: center;
  margin-top: 20px;
  color: green;
}

.error input {
  border-color: red;
}

.error .validation-text {
  color: red;
}

.error .form-group input {
  border-color: red;
}

.error #cvv {
  border-color: red;
}

.success #cvv {
  border-color: green;
}

.error #expiryMonth,
.error #expiryYear {
  border-color: red;
}

.success input {
  border-color: green;
}

.success input {
  border-color: green;
}

.success .validation-text {
  color: green;
}
</style>
