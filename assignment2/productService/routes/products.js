var express = require("express");
var router = express.Router();
var ObjectId = require("mongodb").ObjectID;

router.get("/", function (req, res, next) {
    res.render("index", { title: "Assignment 2" });
});

router.get("/load_page", (req, res) => {
    var productCol = req.db.get("productCollection");
    var category = req.query.category;
    var searchString = req.query.searchString;
    /* 
     1.1.1 search product according to the category and name in searchString;
     1.1.2 Return JSON string of name, price, image
    */

    productCol
        .find(
            {
                category: { $regex: category },
                name: { $regex: searchString, $options: "i" },
            },
            { sort: { name: 1 } }
        )
        .then((docs) => {
            var json = [];
            docs.forEach((element) => {
                var obj = {
                    _id: element._id,
                    name: element.name,
                    price: element.price,
                    image: element.image,
                    category: element.category,
                };
                json.push(obj);
            });
            res.json(json);
        });
});

router.get("/load_product/:productID", (req, res) => {
    var productCol = req.db.get("productCollection");
    var productID = req.params.productID;
    /* 
    1.2.1 retrieve manufacturer and description of product
    1.2.2 Return JSON string if success; else an error message
    */
    console.log(ObjectId(productID));

    productCol.findOne({ _id: ObjectId(productID) }).then((doc) => {
        if (!doc) {
            console.log("product not found");
            res.json({ msg: "" });
        } else {
            console.log(doc.name + " is sent");
            var obj = {
                manufacturer: doc.manufacturer,
                description: doc.description,
            };
            res.json(obj);
        }
    });
});

router.post("/signin", (req, res) => {
    var userCol = req.db.get("userCollection");
    var username = req.body.username;
    var password = req.body.password;

    /*
     1.3.1 checks username and password in body in userCol
     1.3.2 if no, send "Login failure"; else set a cookie "userId", store user's _id, retrieve and send totalnum
    */
    console.log("Retrieve username: %s", username);
    console.log("Retrieve password: %s", password);
    userCol.findOne({ username: username, password: password }).then((doc) => {
        if (!doc) {
            res.send({ msg: "Login failure" });
        } else {
            var obj = {
                totalNum: doc.totalnum,
                userId: doc._id,
            };

            req.cookies.userId = doc._id;
            res.cookie("userId", doc._id);
            res.send(obj);
            console.log("cookie should be sent " + req.cookies.userId);
        }
    });
});

router.get("/signout", (req, res) => {
    res.clearCookie("userId");
    res.send("");
});

router.get("/get_session_info", (req, res) => {
    var userCol = req.db.get("userCollection");
    /* 
    1.5.1 checks if "userId" cookie is set
    1.5.2 yes: retrieve username and totalnum form userCol, send them to client and the error message, otherwise; No: send empty info.
    */

    if (!req.cookies.userId) {
        console.log("no cookie set");
        res.send({ msg: "", isLoggedIn: false });
    } else {
        console.log("request cookie " + req.cookies.userId);
        userCol.findOne({ _id: ObjectId(req.cookies.userId) }).then((doc) => {
            if (!doc) {
                console.log("not found in user collection");
                res.send({ msg: "" });
            } else {
                var json = {
                    username: doc.username,
                    totalnum: doc.totalnum,
                };
                console.log("successfully send user");
                res.send(json);
            }
        });
    }
});

router.post("/add_to_cart", (req, res) => {
    var userCol = req.db.get("userCollection");
    var productId = req.body.productId;
    var quantity = req.body.quantity;
    /*
    1.6.1 according to the productId and quantity in the req.body, update cart of current user
    1.6.2 if productId is not in cart, add it; else increase quantity -> *increase totalnum in user
    1.6.3 Return totalnum if success; else an error message
    */

    if (!req.cookies.userId || !productId || !quantity) {
        res.send({ msg: "ERROR" });
        return;
    }

    userCol.findOne({ _id: ObjectId(req.cookies.userId) }).then((doc) => {
        if (!doc) {
            res.send({ msg: "No such user" });
            return;
        } else {
            var new_product = doc.cart.find(
                (product) => product.productId == productId
            );
            var new_cart = doc.cart;
            var new_totalnum = parseInt(
                parseInt(doc.totalnum) + parseInt(quantity)
            );
            if (!new_product) {
                console.log("no product in cart");
                new_cart.push({
                    productId: productId,
                    quantity: parseInt(quantity),
                });
            } else {
                console.log("Should update total number");
                var index = new_cart.findIndex(
                    (obj) => obj.productId == productId
                );
                new_cart[index].quantity = parseInt(
                    parseInt(new_cart[index].quantity) + parseInt(quantity)
                );
            }
            userCol.update(
                { _id: ObjectId(req.cookies.userId) },
                { $set: { cart: new_cart, totalnum: new_totalnum } }
            );
        }
        res.send({ totalnum: new_totalnum });
    });

    // userCol.update({ _id: ObjectId(req.cookies.userId) }, {});
});

router.get("/load_cart", (req, res) => {
    var userCol = req.db.get("userCollection");
    var productCol = req.db.get("productCollection");

    /*
    1.7.1 retrieve productId and quantity in cart, plus totalnum in userCol
    1.7.2 retrieve name, price, image form productId in productCol
    1.7.3 Send JSON string of retrieved information if success; else send an error message
    */

    userCol.findOne({ _id: req.cookies.userId }).then((doc) => {
        var json = { totalnum: doc.totalnum };

        asyncForEach(doc.cart, productCol).then((result) => {
            if (!result) {
                res.send({ msg: "No product in cart" });
                return;
            }
            json.cart = Array.from(result);
            console.log(json);
            res.send(json);
        });
    });
});

async function asyncForEach(cart, productCol) {
    var result = new Set();
    for (const product of cart) {
        result.add(
            await productCol
                .findOne({ _id: ObjectId(product.productId) })
                .then((res) => {
                    return {
                        _id: res._id,
                        name: res.name,
                        price: res.price,
                        image: res.image,
                        quantity: product.quantity,
                    };
                })
        );
    }
    return result;
}

router.post("/update_cart", (req, res) => {
    var userCol = req.db.get("userCollection");
    var quantity = req.body.quantity;
    var productId = req.body.productId;

    /*
    1.8.1 update quantity and totalnum from body in userCol
    1.8.2 Return totalnum if success; else send an error message
    */
    userCol.findOne({ _id: req.cookies.userId }).then((doc) => {
        if (!doc) {
            res.send({ msg: "No product founded in cart" });
            return;
        }
        var index = doc.cart.findIndex(
            (product) => product.productId === productId
        );
        var new_totalnum =
            parseInt(doc.totalnum) -
            parseInt(doc.cart[index].quantity) +
            parseInt(quantity);

        var new_cart = doc.cart;
        new_cart[index].quantity = parseInt(quantity);

        userCol
            .update(
                { _id: req.cookies.userId },
                {
                    $set: {
                        totalnum: new_totalnum,
                        cart: new_cart,
                    },
                }
            )
            .then((result) => {
                console.log(result);
                console.log("update success: " + new_totalnum);
                res.send({ totalnum: new_totalnum });
            });
    });
});

router.get("/delete_from_cart/:productId", (req, res) => {
    var userCol = req.db.get("userCollection");
    var productId = req.params.productId;
    console.log(req.cookies.userId);
    /*
     1.9.1 update totalnum from body in userCol
     1.9.2 Return totalnum if success; else send an error message
    */
    userCol.findOne({ _id: req.cookies.userId }).then((doc) => {
        if (!doc) {
            res.send({ msg: "No product founded in cart" });
            return;
        }
        var index = doc.cart.findIndex(
            (product) => product.productId === productId
        );
        var new_cart = doc.cart.filter(
            (product) => product.productId !== productId
        );
        var new_totalnum =
            parseInt(doc.totalnum) - parseInt(doc.cart[index].quantity);

        userCol
            .update(
                { _id: req.cookies.userId },
                {
                    $set: {
                        totalnum: new_totalnum,
                        cart: new_cart,
                    },
                }
            )
            .then((result) => {
                console.log(result);
                console.log("delete success: " + new_totalnum);
                res.send({ totalnum: new_totalnum });
            });
    });
});

router.get("/checkout", (req, res) => {
    var userCol = req.db.get("userCollection");
    /*
    1.10.1 empty cart of user in userCol
    1.10.2 set totalnum to 0
    */
    userCol.update(
        { _id: req.cookies.userId },
        { $set: { totalnum: 0, cart: [] } },
        function (err, result) {
            if (err) {
                res.send({ msg: err });
                return;
            }
            if (result) {
                res.send({ msg: "" });
            }
        }
    );
});

module.exports = router;
