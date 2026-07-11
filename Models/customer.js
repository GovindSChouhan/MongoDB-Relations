const mongoose = require("mongoose");
const { Schema } = mongoose;

// =======================================
// Connect to MongoDB
// =======================================
main()
    .then(() => console.log("Connected Successfully"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/relationLearn");
}

// =======================================
// Order Schema
// Defines the structure of an Order document
// =======================================
const orderSchema = new Schema({
    item: String,
    price: Number,
});

// =======================================
// Customer Schema
// One Customer can have MANY Orders
// Orders are stored as ObjectIds (References)
// =======================================
const customerSchema = new Schema({
    name: String,

    orders: [
        {
            // Stores the ObjectId of an Order document
            type: Schema.Types.ObjectId,

            // Tells Mongoose these ObjectIds belong to the Order model
            ref: "Order",
        },
    ],
});

// =======================================
// Create Models
// =======================================
const Order = mongoose.model("Order", orderSchema);
const Customer = mongoose.model("Customer", customerSchema);

// =======================================
// Add Customer and Link Existing Orders
// =======================================
const addCustomer = async () => {

    // Create a new customer
    let cust1 = new Customer({
        name: "Govind",
    });

    // Find existing orders from the Order collection
    let order1 = await Order.findOne({ item: "chips" });
    let order2 = await Order.findOne({ item: "chocolate" });

    // Add order references to the customer
    // Mongoose automatically stores only the ObjectIds
    // (order1._id and order2._id)
    cust1.orders.push(order1);
    cust1.orders.push(order2);

    // Save customer document
    let result = await cust1.save();

    console.log("Customer Saved:");
    console.log(result);

    // ===================================
    // Populate
    // ===================================
    // Without populate():
    // orders -> [ObjectId(...), ObjectId(...)]

    // With populate():
    // orders -> Full Order Documents

    let customers = await Customer.find({}).populate("orders");

    console.log("\nCustomer With Orders:");
    console.log(customers);
};

addCustomer();


// ======================================================
// Run this ONCE to insert sample orders into MongoDB
// Then comment it again.
// ======================================================

// const addOrders = async () => {

//     let res = await Order.insertMany([
//         {
//             item: "samosa",
//             price: 12,
//         },
//         {
//             item: "chips",
//             price: 10,
//         },
//         {
//             item: "chocolate",
//             price: 20,
//         },
//     ]);

//     console.log(res);
// };

// addOrders();