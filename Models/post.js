const mongoose = require("mongoose");
const { Schema } = mongoose;

// ================================
// Connect to MongoDB
// ================================
main()
    .then(() => console.log("Connected Successfully"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/relationLearn");
}

// ================================
// User Schema
// One User can have many Posts
// ================================
const userSchema = new Schema({
    username: String,
    email: String,
});

// ================================
// Post Schema
// Each Post belongs to ONE User
// ================================
const postSchema = new Schema({
    content: String,
    likes: Number,

    // Store the ObjectId of the User
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

// ================================
// Create Models
// ================================
const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

// ================================
// Insert Data
// ================================
const addData = async () => {

    // Create ONE user
    let user1 = new User({
        username: "Govind",
        email: "govind@gmail.com",
    });

    // Save the user first
    await user1.save();

    // ============================
    // First Post
    // ============================
    let post1 = new Post({
        content: "Hello Everyone!",
        likes: 10,
    });

    // Assign post to user
    // Mongoose automatically stores user1._id
    post1.user = user1;

    await post1.save();

    // ============================
    // Second Post
    // Same User, Different Post
    // ============================
    let post2 = new Post({
        content: "Learning MongoDB Relationships",
        likes: 25,
    });

    // Again assign the SAME user
    post2.user = user1;

    await post2.save();

    console.log("✅ User Saved:");
    console.log(user1);

    console.log("\n✅ First Post Saved:");
    console.log(post1);

    console.log("\n✅ Second Post Saved:");
    console.log(post2);
};

// Run Function
addData();