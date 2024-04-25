let express = require("express");
let app = express();
const url = "mongodb://localhost:27017/shop";
const mongoose = require("mongoose");
const Customers = require("./models/Customers");
const Product = require("./models/Products");

const Orders = require("./models/Orders");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// hämtar produkter
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

//AGGREGATION FÖR ALLA GET:
app.get("/orders-with-details", async (req, res) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: "lineItems",
          localField: "orderId",
          foreignField: "id",
          as: "lineItems",
          pipeline: [
            {
              $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "id",
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
          localField: "customerId",
          foreignField: "_Id",
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

app.post("/create-product", async (req, res) => {
  try {
    // Extract product data from the request body
    const { name, description, price, image, inStock, status } = req.body;

    const product = new Product({
      name,
      description,
      price,
      image,
      inStock,
      status,
    });

    // Save the product to the database
    const result = await product.save();

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding product");
  }
});

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

//DELETE PRODUCT:
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

//saker till ordrar
// app.get("/orders", async (request, response) => {
//   try {
//     await mongoose
//       .connect("mongodb://localhost:27017/shop")
//       .then(console.log("connected to database"));

//     Orders.find().then((result) => {
//       response.send(result);
//       mongoose.connection.close();
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

app.post("/create-order", async (request, response) => {
  try {
    const order = new Orders({
      _id: "678",
      customer: "test@testsson.test",
      orderDate: new Date(),
      status: "unpaid",
      totalPrice: 20,
      paymentId: "unpaid",
    });
    order.save().then((result) => {
      response.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

app.put("/update-order", async (request, response) => {
  try {
    Orders.findByIdAndUpdate("678", {
      status: "paid",
    }).then((result) => {
      response.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//saker till användare
// Hämtar användare
// app.get("/customers", async (request, response) => {
//   try {
//     await mongoose
//       .connect("mongodb://localhost:27017/shop")
//       .then(console.log("connected to database"));

//     Customers.find().then((result) => {
//       response.send(result);
//       mongoose.connection.close();
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// Lägger till användare
app.post("/create-customer", async (request, response) => {
  try {
    const customer = new Customers({
      _id: "nurydberg@najssomfan.se",
      firstName: "Nur",
      lastName: "Rydberg",
      address: "Kungsgatan 1",
      password: "1234",
    });

    customer.save().then((result) => {
      response.send(result);
    });
    clear;
  } catch (error) {
    console.log(error);
  }
});

// Uppdaterar existerande användare
app.put("/update-customer", async (request, response) => {
  try {
    Customers.findByIdAndUpdate("nurydberg@najssomfan.se", {
      firstName: "Emelie",
      lastName: "Granath",
      address: "Drottninggatan",
    }).then((result) => {
      response.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

mongoose.connect(url).then(() => {
  console.log("connected to database");
  app.listen(3000, () => {
    console.log("Server is running...");
  });
});
