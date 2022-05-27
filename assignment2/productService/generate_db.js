var conn = new Mongo();

var db = conn.getDB("assignment2");

// TODO: at least 8 products
var product_names = [
    "iPhone 13",
    "iPhone 12",
    "Samsung Galaxy S22",
    "iPad Air",
    "Gensen Bonito",
];
var product_categories = ["Phones", "Phones", "Phones", "iPads", "Pet Food"];
var product_prices = [8000, 5000, 5898, 4799, 17];
var product_manufacturers = [
    "Apple Inc.",
    "Apple Inc.",
    "Samsung Electronics Co., Ltd.",
    "Apple Inc.",
    "MonPetit",
];
var product_images = [];
var product_descriptions = [
    "Most advanced dual camera system ever.",
    "All in a completely refreshed design.",
    "The epic new standard.",
    "The new iPad Air, now with the Apple M1 chip and in five gorgeous colors.",
];

if (db.productCollection) {
    db.productCollection.drop();
}

if (db.userCollection) {
    db.userCollection.drop();
}

for (let product_name of product_names) {
    product_images.push(`/${product_name}.png`);
}

for (let i = 0; i < product_names.length; i++) {
    db.productCollection.insert({
        name: product_names[i],
        category: product_categories[i],
        price: product_prices[i],
        manufacturer: product_manufacturers[i],
        image: product_images[i],
        description: product_descriptions[i],
    });
}

var usernames = ["Jack"];
var passwords = ["654321"];
var carts = []; //each cart is a map, containing productID and quantity

for (let i = 0; i < usernames.length; i++) {
    var cart;
    var totalNum;
    if (carts[i] == null) {
        cart = [];
        totalNum = 0;
    } else {
        cart = carts[i];
        cart.forEach((e) => {
            totalNum += e.quantity;
        });
    }
    db.userCollection.insert({
        username: usernames[i],
        password: passwords[i],
        cart: cart,
        totalnum: totalNum,
    });
}
