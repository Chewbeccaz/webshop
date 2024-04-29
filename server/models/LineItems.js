const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lineItemsSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Orders",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Explicitly set the collection name to 'lineItems'
const LineItems = mongoose.model("LineItems", lineItemsSchema, "lineItems");
module.exports = LineItems;
