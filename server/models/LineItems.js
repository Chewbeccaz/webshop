const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lineItemsSchema = new Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Orders",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const LineItem = mongoose.model("lineitems", lineItemsSchema);
module.exports = LineItem;
