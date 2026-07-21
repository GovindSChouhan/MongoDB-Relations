# MongoDB Relationships using Mongoose 🚀
>
> This repository is created for learning and practicing different types of MongoDB Relationships using **Node.js + MongoDB + Mongoose**.
>
> **Important Note:** The comments inside the JavaScript files are intentionally written in **Hindi + English (Hinglish)** for my personal understanding and quick revision.

---

# 📂 Project Structure

```
Models/
│
├── user.js         → Embedded Documents
├── post.js         → One-to-One Relationship
├── customer.js     → One-to-Many Relationship + populate()
├── customers.js    → Middleware + Cascade Delete
│
├── package.json
└── package-lock.json
```

---

# 🎯 Goal of this Repository

This repository is created to understand:

- Embedded Documents
- One-to-One Relationship
- One-to-Many Relationship
- ObjectId
- ref
- populate()
- Mongoose Middleware
- Cascade Delete

Instead of only learning theory, every concept is implemented using code.

---

# 📌 Before Starting

Understand these three terms first.

## 1. Schema

A Schema is a blueprint of a document.

Example:

```javascript
const userSchema = new Schema({
    username: String,
    email: String
});
```

Think of Schema as:

```
Blueprint
↓

Structure of Document
```

---

## 2. Model

A Model is created from Schema.

```javascript
const User = mongoose.model("User", userSchema);
```

Think of Model as:

```
Schema

↓

Collection Controller
```

A Model is used to interact with MongoDB.

Example

```javascript
User.find()

User.save()

User.deleteMany()
```

---

## 3. Document

A single object stored inside MongoDB.

Example

```javascript
let user = new User({
    username:"Govind"
});
```

Think

```
Collection

↓

Many Documents

↓

One Document
```

---

# 📖 1. Embedded Documents

📄 File: **user.js**

---

## What is Embedded Document?

Instead of creating multiple collections,
MongoDB allows us to store related data inside one document.

Example

```
User

↓

Address
```

MongoDB

```javascript
{
    username:"Govind",

    address:[
        {
            location:"Guna",
            city:"MP"
        },

        {
            location:"Indore",
            city:"MP"
        }
    ]
}
```

Everything is stored together.

---

## Why use Embedded Documents?

Because Address belongs only to that User.

No need for another collection.

---

## Advantages

✅ Faster Reading

✅ Simpler Queries

✅ Single Document

---

## Disadvantages

❌ Large document size

❌ Duplicate data if reused

---

## Code to Observe

Open

```
user.js
```

Notice these lines

```javascript
address:[
    {
        location:String,
        city:String
    }
]
```

and

```javascript
user.address.push(...)
```

This shows how embedded documents are added.

---

# 📖 2. One-to-One Relationship

📄 File:

```
post.js
```

---

Imagine Instagram.

Every Post belongs to one User.

```
User

↓

One Post
```

Instead of storing complete User,

MongoDB stores only User's ObjectId.

Example

```javascript
user:{
    type:Schema.Types.ObjectId,
    ref:"User"
}
```

---

## Meaning of ObjectId

ObjectId is simply MongoDB's unique ID.

Example

```
687abc123xyz...
```

Instead of saving

```
Username

Email

Phone

Age
```

MongoDB stores only

```
ObjectId
```

which points to User.

---

## Meaning of ref

```javascript
ref:"User"
```

means

> "This ObjectId belongs to User Collection."

Without ref,

populate() will never know where to search.

---

## Code to Observe

```javascript
post.user = user;
```

Meaning

Assign this Post to this User.

Then

```javascript
await user.save();

await post.save();
```

Always save documents.

---

# 📖 3. One-to-Many Relationship

📄 File:

```
customer.js
```

---

Example

```
One Customer

↓

Many Orders
```

A Customer can order many items.

Instead of storing complete Orders,

MongoDB stores Order IDs.

Schema

```javascript
orders:[
    {
        type:Schema.Types.ObjectId,
        ref:"Order"
    }
]
```

Meaning

```
Customer

↓

orders[]

↓

ObjectIds
```

---

Adding Orders

```javascript
customer.orders.push(order)
```

This stores Order's ObjectId inside Customer.

Not the complete Order.

---

## populate()

Without populate()

```
orders

687abc

687xyz
```

Looks useless.

Using

```javascript
.populate("orders")
```

becomes

```
Burger

Pizza

Cold Drink
```

Because populate replaces ObjectIds with complete documents.

---

# 📖 4. Middleware

📄 File

```
customers.js
```

---

Middleware means

Run some code automatically.

Example

```
Delete Customer

↓

Automatically Delete Orders
```

Instead of writing delete code manually every time,

Middleware does it automatically.

Example

```javascript
customerSchema.post("findOneAndDelete",async(customer)=>{

});
```

Meaning

After deleting Customer,

run this function.

---

# Cascade Delete

Suppose

```
Govind

↓

Burger

↓

Pizza
```

If Govind is deleted,

Burger and Pizza should also disappear.

Otherwise,

database becomes dirty.

Middleware solves this.

Example

```javascript
await Order.deleteMany({
    _id:{
        $in:customer.orders
    }
});
```

Meaning

Delete every Order whose ID exists inside

```
customer.orders
```

---

# Understanding $in

Suppose

```
customer.orders

[
101,
102,
103
]
```

Then

```javascript
$in
```

means

Delete documents whose IDs are

```
101

OR

102

OR

103
```

---

# Why await?

Database operations take time.

Without await,

Next line executes immediately.

Example

```javascript
await user.save();
```

Meaning

Wait until data is actually stored.

Then move to next line.

---

# populate() Flow

```
Customer

↓

orders[]

↓

ObjectIds

↓

populate()

↓

Complete Orders
```

---

# Middleware Flow

```
Delete Customer

↓

Middleware Runs

↓

Read customer.orders

↓

Delete Matching Orders

↓

Database Clean
```

---

# SQL vs MongoDB

| SQL | MongoDB |
|------|----------|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| Foreign Key | ObjectId |
| JOIN | populate() |

---

# Common Interview Questions

### Why ObjectId?

To create relationships between collections.

---

### Why ref?

To tell Mongoose which collection the ObjectId belongs to.

---

### Why populate()?

To replace ObjectIds with complete documents.

---

### Why Middleware?

To execute code automatically before or after an operation.

---

### What is Cascade Delete?

Automatically deleting child documents when parent document is deleted.

---

### Embedded vs Referencing?

Embedded

- Small Data
- Always together
- Fast reading

Referencing

- Large Data
- Reusable
- Better scalability

---

# Common Mistakes I Made While Learning 😅

❌ `new postSchema()`

✅ `new Post()`

---

❌ `post.data()`

✅ `post.save()`

---

❌ `customer.order`

✅ `customer.orders`

---

❌ Forgetting `await`

Database operation may not complete properly.

---

❌ Forgetting `ref`

populate() will not work.

---

# Final Learning Flow

```
Schema

↓

Model

↓

Document

↓

Embedded Documents

↓

ObjectId

↓

ref

↓

populate()

↓

Middleware

↓

Cascade Delete
```

---

# Personal Note

This repository is created for learning MongoDB relationships from scratch.

Whenever I forget the concepts in the future:

1. Read this README from top to bottom.
2. Open the corresponding JavaScript file.
3. Read the Hinglish comments inside the code.
4. Run the program again.
5. Practice by modifying the data.

Following these steps should be enough to revise the complete topic without watching tutorials again.

---

⭐ If you found this repository helpful, feel free to explore the code and experiment with your own relationships.
