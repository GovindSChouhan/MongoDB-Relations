# MongoDB Relationships - Complete Revision Notes

# 1. One-to-One (1:1)

## Definition

> One document is related to only one document, and vice versa.

### Example

- User ↔ Passport
- Country ↔ Prime Minister

---

## Schema

```javascript
const passportSchema = new Schema({
    passportNo: String,
});

const userSchema = new Schema({
    username: String,

    passport: {
        type: Schema.Types.ObjectId,
        ref: "Passport",
    },
});
```

---

## MongoDB Data

### User Collection

```javascript
{
    username: "Govind",
    passport: ObjectId("689ab...")
}
```

### Passport Collection

```javascript
{
    passportNo: "P123456"
}
```

---

## Memory Trick

> **One ↔ One**

One User → One Passport

---

# 2. One-to-Many (1:M)

There are **two ways** to implement it.

---

# A. Embedded One-to-Many

## Definition

Related documents are stored inside the parent document.

### Example

- User → Addresses

---

## Schema

```javascript
const userSchema = new Schema({
    username: String,

    address: [
        {
            location: String,
            city: String,
        },
    ],
});
```

---

## MongoDB Data

```javascript
{
    username: "Govind",

    address: [
        {
            location: "Sada",
            city: "Guna"
        },
        {
            location: "Sanda",
            city: "Gunaa"
        }
    ]
}
```

---

## Advantages

- Fast reading
- Single query
- Easy to implement

---

## Use When

- Child data is always used with parent.
- Child data is small.
- Child data does not grow much.

---

## Example

- User → Address
- Product → Specifications

---

## Memory Trick

> **Together use hota hai → Embed**

---

# B. Reference One-to-Many

## Definition

Parent stores the ObjectIds of child documents.

### Example

- Customer → Orders

---

## Schema

```javascript
const customerSchema = new Schema({
    name: String,

    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
});
```

---

## Order Schema

```javascript
const orderSchema = new Schema({
    item: String,
    price: Number,
});
```

---

## MongoDB Data

### Customer

```javascript
{
    name: "Govind",

    orders: [
        ObjectId("689ab..."),
        ObjectId("689ac...")
    ]
}
```

### Order

```javascript
{
    item: "Chips",
    price: 10
}
```

---

## Populate

```javascript
Customer.find().populate("orders");
```

Without populate

```javascript
orders: [
    ObjectId(...),
    ObjectId(...)
]
```

With populate

```javascript
orders: [
    {
        item: "Chips",
        price: 10
    },
    {
        item: "Chocolate",
        price: 20
    }
]
```

---

## Advantages

- Child documents are independent.
- Easy to update.
- Better for large data.

---

## Use When

- Child data is large.
- Child data grows continuously.
- Child data is accessed separately.

---

## Example

- Customer → Orders
- User → Wishlist

---

## Memory Trick

> **Alag access karna hai → Reference**

---

# C. Parent Reference (Most Common)

## Definition

Instead of storing child IDs in the parent,
the child stores the parent's ObjectId.

### Example

Instagram

One User → Many Posts

Each Post stores User ID.

---

## User Schema

```javascript
const userSchema = new Schema({
    username: String,
    email: String,
});
```

---

## Post Schema

```javascript
const postSchema = new Schema({
    content: String,
    likes: Number,

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});
```

---

## MongoDB Data

### User

```javascript
{
    username: "Govind"
}
```

### Posts

```javascript
{
    content: "Hello",
    likes: 10,
    user: ObjectId("689ab...")
}
```

```javascript
{
    content: "Learning MongoDB",
    likes: 25,
    user: ObjectId("689ab...")
}
```

Notice:

Both posts store the same User ObjectId.

---

## Why Parent Reference?

No huge arrays.

Imagine:

Govind uploads

- 10 posts
- 100 posts
- 10,000 posts

If User stored all post IDs, the array would become huge.

Instead,

Every Post stores User ID.

---

## Advantages

- Scalable
- No huge arrays
- Best for social media

---

## Example

- User → Posts
- Teacher → Students
- Company → Employees

---

## Memory Trick

> **Child stores Parent ID**

---

# 3. Many-to-Many (M:N)

## Definition

Many documents in one collection can relate to many documents in another collection.

### Example

- Students ↔ Courses

One Student → Many Courses

One Course → Many Students

---

## Schema

```javascript
const studentSchema = new Schema({
    name: String,

    courses: [
        {
            type: Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
});
```

```javascript
const courseSchema = new Schema({
    title: String,

    students: [
        {
            type: Schema.Types.ObjectId,
            ref: "Student",
        },
    ],
});
```

---

## MongoDB Data

Student

```javascript
{
    name: "Govind",

    courses: [
        ObjectId(...),
        ObjectId(...)
    ]
}
```

Course

```javascript
{
    title: "DBMS",

    students: [
        ObjectId(...),
        ObjectId(...)
    ]
}
```

---

## Example

- Student ↔ Course
- Actor ↔ Movie
- User ↔ Group

---

## Memory Trick

> **Many ↔ Many**

---

# populate()

## Purpose

Replace ObjectIds with actual documents.

```javascript
Customer.find().populate("orders");
```

Instead of

```javascript
orders: [
    ObjectId(...)
]
```

You get

```javascript
orders: [
    {
        item: "Chips",
        price: 10
    }
]
```

---

# Interview Revision

## type

```javascript
type: Schema.Types.ObjectId
```

Stores another document's ObjectId.

---

## ref

```javascript
ref: "Order"
```

Tells Mongoose which Model that ObjectId belongs to.

---

## push()

```javascript
customer.orders.push(order1);
```

Automatically stores

```javascript
order1._id
```

---

## populate()

Replaces ObjectIds with complete documents.

---

# Final Comparison

| Relationship | Storage | Example |
|-------------|---------|---------|
| One-to-One | ObjectId | User → Passport |
| One-to-Many (Embedded) | Child documents inside parent | User → Addresses |
| One-to-Many (Reference Array) | Parent stores child ObjectIds | Customer → Orders |
| One-to-Many (Parent Reference) | Child stores parent ObjectId | User → Posts |
| Many-to-Many | Both store ObjectIds (or use a junction collection depending on design) | Student ↔ Course |

---

# 30-Second Revision

- **1:1** → One User → One Passport.
- **1:M (Embedded)** → User → Addresses (together use hota hai).
- **1:M (Reference Array)** → Customer → Orders (parent stores child IDs).
- **1:M (Parent Reference)** → User → Posts (child stores parent ID).
- **M:N** → Student ↔ Courses.
- **ObjectId** → Stores another document's ID.
- **ref** → Model name.
- **populate()** → ObjectId → Complete Document.