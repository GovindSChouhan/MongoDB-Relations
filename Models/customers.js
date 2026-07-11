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
const orderSchema = new Schema({
    item: String,
    price: Number,
});

// =======================================
// Customer Schema
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

//Mongoes middleWare  
    // customerSchema.pre("findOneAndDelete", async() =>{
    //     console.log("Pre middleWare");
    // });

    customerSchema.post("findOneAndDelete", async (customer) => {
    if (customer.orders.length) {
        let res = await Order.deleteMany({
            _id: { $in: customer.orders }
        });

        console.log(res);
    }
});


// Create Models
// =======================================
const Order = mongoose.model("Order", orderSchema);
const Customer = mongoose.model("Customer", customerSchema);


const findCustomer = async() => {
   let result = await Customer.find({}).populate("orders");
    console.log(result[0]);

};
   
//2func  to add a custo into database and to dele cus to the database
//New Customer
const addCust = async () =>{
    let newCust = new Customer({
        name : "karan"
    });


    let newOrder = new Order({
        item : "burger",
        price : 230,
    });

    newCust.orders.push(newOrder);
    
    await newOrder.save();
    await newCust.save();

    console.log("added new customers");
};

const delCust = async () => {
    let data = await Customer.findByIdAndDelete('6a51bd19c2f7ba0bb56737bf');
    console.log(data);
}

const clearDB = async () => {
    await Customer.deleteMany({});
    await Order.deleteMany({});

    console.log("Database Cleared");
};

//clearDB();
//addCust();
delCust();
