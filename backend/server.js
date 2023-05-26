const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

function validateCreditCardNumber(creditCardNumber) {
  const digits = creditCardNumber.replace(/\s/g, "").split("").map(Number);
  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

app.post("/api/formdata", (req, res) => {
  const { creditCardNumber, expiryMonth, expiryYear } = req.body;

  const cleanedCreditCardNumber = creditCardNumber.replace(/\s/g, "");

  const errors = [];

  if (!/^[0-9]{16,19}$/.test(cleanedCreditCardNumber)) {
    errors.push("Credit card number incorrect!");
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (
    !/^(0?[1-9]|1[0-2])$/.test(expiryMonth) ||
    expiryMonth === "0" ||
    expiryMonth === "00"
  ) {
    errors.push("Expiry month incorrect!");
  }

  if (!/^\d{2}(\d{2})?$/.test(expiryYear)) {
    errors.push("Expiry year incorrect!");
  } else {
    const extractedYear =
      expiryYear.length === 2
        ? currentYear.toString().substr(0, 2) + expiryYear
        : expiryYear;

    if (
      Number(extractedYear) <= currentYear &&
      Number(expiryMonth) <= currentMonth
    ) {
      errors.push("Expiry date has already passed!");
    }
  }

  const startsWith34Or37 =
    cleanedCreditCardNumber.startsWith("34") ||
    cleanedCreditCardNumber.startsWith("37");
  const isAmexCard = startsWith34Or37;
  const cvvLength = isAmexCard ? 4 : 3;
  if (!/^\d{3,4}$/.test(req.body.cvv) || req.body.cvv.length !== cvvLength) {
    errors.push("CVV incorrect!");
  }

  if (!validateCreditCardNumber(cleanedCreditCardNumber)) {
    errors.push("Invalid credit card number!");
  }

  res.json({
    isValid: errors.length === 0,
    errors: errors,
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
