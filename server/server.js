let express = require("express");
let app = express();
const mongoose = require("mongoose");
const Customers = require("./models/Customers");
const Product = require("./models/Products");
const Orders = require("./models/Orders");

// hämtar produkter
app.get("/", async (request, response) => {
  try {
    await mongoose
      .connect("mongodb://localhost:27017/shop")
      .then(console.log("connected to database"));

    Product.find().then((result) => {
      response.send(result);
      mongoose.connection.close();
    });
  } catch (error) {
    console.log(error);
  }
});

//AGGREGATION FÖR ALLA GET:
app.get("/orders-with-details", async (req, res) => {
  try {
    await mongoose
      .connect("mongodb://localhost:27017/shop")
      .then(console.log("connected to database"));
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

// Lägger till produkter
app.post("/create-product", async (request, response) => {
  try {
    await mongoose
      .connect("mongodb://localhost:27017/shop")
      .then(console.log("created product"));

    const product = new Product({
      name: "Grapes",
      description: "Grapes",
      price: 39,
      image:
        "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      inStock: 30,
      status: "active",
    });

    product.save().then((result) => {
      response.send(result);
      mongoose.connection.close();
    });
  } catch (error) {
    console.log(error);
  }
});

// Uppdaterar existerande produkter
app.put("/update-product", async (request, response) => {
  try {
    await mongoose
      .connect("mongodb://localhost:27017/shop")
      .then(console.log("connected"));

    Products.findByIdAndUpdate("321", {
      description: "en rolig sak",
    }).then((result) => {
      response.send(result);
      mongoose.connection.close();
    });
  } catch (error) {
    console.log(error);
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
    await mongoose
      .connect("mongodb://localhost:27017/shop")
      .then(console.log("connected to database"));

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
      mongoose.connection.close();
    });
  } catch (error) {
    console.log(error);
  }
});

app.put("/update-order", async (request, response) => {
  try {
    await mongoose
      .connect("mongodb://localhost:27017/shop")
      .then(console.log("connected"));

    Orders.findByIdAndUpdate("678", {
      status: "paid",
    }).then((result) => {
      response.send(result);
      mongoose.connection.close();
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
    await mongoose
      .connect("mongodb://localhost:27017/shop")
      .then(console.log("connected to database"));

    const customer = new Customers({
      _id: "nurydberg@najssomfan.se",
      firstName: "Nur",
      lastName: "Rydberg",
      address: "Kungsgatan 1",
      password: "1234",
    });

    customer.save().then((result) => {
      response.send(result);
      mongoose.connection.close();
    });
    clear;
  } catch (error) {
    console.log(error);
  }
});

// Uppdaterar existerande användare
app.put("/update-customer", async (request, response) => {
  try {
    await mongoose
      .connect("mongodb://localhost:27017/shop")
      .then(console.log("connected to database"));

    Customers.findByIdAndUpdate("nurydberg@najssomfan.se", {
      firstName: "Emelie",
      lastName: "Granath",
      address: "Drottninggatan",
    }).then((result) => {
      response.send(result);
      mongoose.connection.close();
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("Server is running...");
});
