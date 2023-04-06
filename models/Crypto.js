const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: { type: String, minLength: 2, required: [true, "Name is required and should be at least 2 characters long"] },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return urlRegex.test(v);
      },
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
  price: {
    type: Number,
    minLenght: 1,
    required: [true, "Price must be positive number!"],
  },
  description: {
    type: String,
    minLenght: 10,
    required: [true, "Description must be at least 10 characters long!"],
  },
  payment: {
    type: String,
    enum: ["crypto-wallet", "credit-card", "debit-card", "paypal"],
    required: [
      true,
      'Payment method must include one of the following: "Crypto Wallet", "Credit Card", "Debit Card", "PayPal"!',
    ],
  },
  boughtBy: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  owner: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Crypto", schema);