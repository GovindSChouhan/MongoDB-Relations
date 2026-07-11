const mongoose = require("mongoose");
const { Schema } = mongoose;

// =======================================
// Connect to MongoDB
// =======================================
main()
    .then(() => console.log("Connected Successfully"))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/relationLearn");
}

// =======================================
// User Schema
// One User can have multiple addresses
// This is an Embedded One-to-Many Relationship
// =======================================
const userSchema = new Schema({
    username: String,

    // Array of embedded address objects
    address: [
        {
            // Prevent MongoDB from creating an _id
            // for every embedded address document
            _id: false,

            location: String,
            city: String,
        },
    ],
});

// =======================================
// Create Model
// =======================================
const User = mongoose.model("User", userSchema);

// =======================================
// Insert User
// =======================================
const addUsers = async () => {

    // Create a new User document
    let user1 = new User({
        username: "govind",

        // First address
        address: [
            {
                location: "sada",
                city: "guna",
            },
        ],
    });

    // Add another address
    // push() inserts a new embedded document
    user1.address.push({
        location: "sanda",
        city: "gunaa",
    });

    // Save the complete user document
    let result = await user1.save();

    console.log(result);
};

addUsers();