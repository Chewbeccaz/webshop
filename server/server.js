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

//GET ORDERS:

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

//AGGREGATION FÖR ALLA GET:
// app.get("/orders-with-details", async (req, res) => {
//   try {
//     const pipeline = [
//       {
//         $lookup: {
//           from: "lineItems",
//           localField: "orderId", //ändra till id
//           foreignField: "id",
//           as: "lineItems",
//           pipeline: [
//             {
//               $lookup: {
//                 from: "products",
//                 localField: "productId", //ändra till id
//                 foreignField: "id",
//                 as: "linkedProduct",
//               },
//             },
//             {
//               $addFields: {
//                 linkedProduct: {
//                   $first: "$linkedProduct",
//                 },
//               },
//             },
//           ],
//         },
//       },
//       {
//         $lookup: {
//           from: "customers",
//           localField: "customerId",
//           foreignField: "_Id",
//           as: "linkedCustomer",
//         },
//       },
//       {
//         $addFields: {
//           linkedCustomer: {
//             $first: "$linkedCustomer",
//           },
//           calculatedTotal: {
//             $sum: "$lineItems.totalPrice",
//           },
//         },
//       },
//     ];

//     const ordersWithDetails = await Orders.aggregate(pipeline);
//     res.json(ordersWithDetails);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

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

// app.post("/create-order", async (request, response) => {
//   try {
//     const order = new Orders({
//       _id: "678",
//       customer: "test@testsson.test",
//       orderDate: new Date(),
//       status: "unpaid",
//       totalPrice: 20,
//       paymentId: "unpaid",
//     });
//     order.save().then((result) => {
//       response.send(result);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

//SKAPA ORDER:
// app.post("/create-order", async (req, res) => {
//   try {
//     const { name, address, totalPrice, paymentId, items } = req.body;

//     if (!name || !address || !totalPrice || !paymentId || !items) {
//       return res
//         .status(400)
//         .send("Name, address, totalPrice, items and paymentId are required");
//     }

//     const order = new Orders({
//       customer: name,
//       address,
//       orderDate: new Date(),
//       status: "paid",
//       totalPrice,
//       paymentId,
//       items,
//     });

//     const result = await order.save();

//     res.send(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error creating order");
//   }
// });

// server.js
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

  // if (!email ||  !name || !address || !orderDate || !status ||  !totalPrice || !paymentId || !products) {
  //   return res
  //     .status(400)
  //     .send("Name, address, totalPrice, paymentId, and items are required");

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

  console.log("this is the order about to be saved", order);

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
    console.log("this is the saved order", savedOrder);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

//     for (const item of items) {
//       console.log(item);
//       const lineItems = new LineItems({
//         orderId: savedOrder._id,
//         product: item.productId,
//         amount: item.quantity,
//         totalPrice: item.price * item.quantity,
//       });
//       console.log(lineItems);
//       await lineItems.save();
//     }

//     res.send(savedOrder);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error creating order");
//   }
// });

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
