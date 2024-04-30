let express = require("express");
let app = express();
const url = "mongodb://localhost:27017/shop";
const mongoose = require("mongoose");
const Customers = require("./models/Customers");
const Product = require("./models/Products");
const LineItems = require("./models/LineItems");

const Orders = require("./models/Orders");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//************************GET PRODUCTS**************************************/

app.get("/", async (request, response) => {
  try {
    Product.find().then((result) => {
      response.send(result);
      console.log("get-anrop");
    });
  } catch (error) {
    console.log(error);
  }
});
//************************GET ORDERS WITH DETAILS**************************************/
app.get("/orders", async (req, res) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: "lineitems",
          localField: "_id",
          foreignField: "orderId",
          as: "lineItems",
          pipeline: [
            {
              $lookup: {
                from: "products",
                localField: "product",
                foreignField: "_id",
                as: "linkedProduct",
              },
            },
            {
              $addFields: {
                linkedProduct: {
                  $first: "$linkedProduct",
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "linkedCustomer",
        },
      },
      {
        $addFields: {
          linkedCustomer: {
            $first: "$linkedCustomer",
          },
          calculatedTotal: {
            $sum: "$lineItems.totalPrice",
          },
        },
      },
    ];
    const ordersWithDetails = await Orders.aggregate(pipeline);
    res.json(ordersWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//************************CREATE PRODUCT**************************************/
app.post("/create-product", async (req, res) => {
  try {
    const { name, description, price, image, inStock, status } = req.body;

    const product = new Product({
      name,
      description,
      price,
      image,
      inStock,
      status,
    });

    const result = await product.save();

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding product");
  }
});

//************************UPDATE PRODUCT**************************************/
app.put("/update-product/:id", async (request, response) => {
  try {
    const { name, description, price, image, inStock, status } = request.body;

    const productId = request.params.id;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        price,
        image,
        inStock,
        status,
      },
      { new: true }
    );

    response.send(updatedProduct);
    console.log("close");
  } catch (error) {
    console.log(error);
    response.status(500).send("Error updating product");
  }
});

//************************DELETE PRODUCT**************************************/
app.delete("/delete-product/:id", async (request, response) => {
  try {
    const productId = request.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    response.send(deletedProduct);
  } catch (error) {
    console.log(error);
    response.status(500).send("Error deleting product");
  }
});

//************************CREATE ORDER**************************************/

app.post("/create-order", async (req, res) => {
  console.log("create-order", req.body);
  const {
    email,
    name,
    address,
    orderDate,
    status,
    totalPrice,
    paymentId,
    products,
  } = req.body;

  const order = new Orders({
    _id: new mongoose.Types.ObjectId(),
    customer: name,
    email: email,
    address: address,
    orderDate: orderDate,
    status: status,
    totalPrice: totalPrice,
    paymentId: paymentId,
    products: products,
  });

  try {
    const savedOrder = await order.save();
    req.body.items.forEach(async (item) => {
      new LineItems({
        orderId: savedOrder._id,
        product: item.product,
        amount: item.amount,
        price: item.price,
      }).save();
      console.log(item);
    });

    console.log("order now saved: ", savedOrder);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

mongoose.connect(url).then(() => {
  console.log("connected to database");
  app.listen(3000, () => {
    console.log("Server is running...");
  });
});
