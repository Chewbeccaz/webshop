const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lineItemsSchema = new Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Orders", //eller Order?
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Explicitly set the collection name to 'lineItems'
const LineItem = mongoose.model("LineItems", lineItemsSchema, "lineItems");
module.exports = LineItem;
