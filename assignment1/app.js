var express = require("express");
var app = express();
var session = require("express-session");
var cookieParser = require("cookie-parser");

var ObjectId = require("mongodb").ObjectID;

app.use(express.json());
app.use(cookieParser());

app.use(
    session({
        secret: "random_string_goes_here",
        resave: false,
        saveUninitialized: true,
    })
);
var monk = require("monk");
var db = monk("127.0.0.1:27017/assignment1-db");

app.use(express.static("public"), function (req, res, next) {
    req.db = db;
    next();
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/" + "newsfeed.html");
});

app.get("/retrieve_news_list", (req, res) => {
    var search_value = req.query.search;
    var loginStatus = 0;

    if (req.cookies.userID) loginStatus = 1;

    var col = req.db.get("newsList");

    col.e([
        { $match: { headline: { $regex: search_value } } },
        {
            $group: {
                _id: "$_id",
                headline: { $first: "$headline" },
                time: { $first: "$time" },
                content: { $first: "$content" },
            },
        },
        { $sort: { time: -1, headline: 1 } },
    ]).then((result) => {
        result.forEach((element) => {
            var simple_content =
                element["content"].split(" ").splice(0, 9).join(" ") + "...";
            element["content"] = simple_content;
        });

        var json = {
            newsList: result,
            loginStatus: loginStatus,
        };
        res.json(json);
    });
});

app.get("/displayNewsEntry", (req, res) => {
    var newsList = req.db.get("newsList");
    var userList = req.db.get("userList");
    var newsID = req.query.newsID;
    // first retrieve the news with newsID
    newsList.find({ _id: newsID }).then((docs) => {
        var start = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>News Feed</title>
        <link rel="stylesheet" href="stylesheets/style.css">
        <script src="javascripts/script.js"></script>
      </head>
      <body>
      `;

        var end = `
      </body>
      </html>`;

        var response = `
      <header>
      <a href="/">
        <img src="/images/back_arrow.png" width="40" height="40">
      </a>
      <div id="top">
      <h1>${docs[0].headline}</h1>
      <p>${docs[0].time.toLocaleString()}</p>
      </div>
      </header>
      <section class="content">
      <div id="content">
        ${docs[0].content}
      </div>
      <div id="comments">
      `;

        var comments = docs[0].comments.reverse();
        asyncForEach(comments, userList).then(function (data) {
            if (data) {
                response += data;
            }

            response += `</div></section>`;

            // check if current user has logged in
            if (req.cookies.userID) {
                response += `
        <div id="post_comment">
          <input type="text" id="comment_input">
          <input type="submit" value="post comment" onclick="postComment()">
        </div>
        `;
            } else {
                response += `
        <div id="post_comment">
          <input type="text" id="comment_input" disabled>
          <a href="/login?newsID=${newsID}">
            <input type="submit" value="login to comment">
          </a>
        </div>
        `;
            }

            res.send(start + response + end);
        });

        // retrieve the name and icon of the users who posted the comment
    });
});

async function asyncForEach(comments, userList) {
    var result = ``;
    for (let i = 0; i < comments.length; i++) {
        var comment = comments[i];
        console.log(comment.time);
        var date = new Date(comment.time);
        var time = date.toLocaleString();
        var userComment = comment.comment;
        result += await userList
            .findOne({ _id: ObjectId(comment.userID) })
            .then((result) => {
                if (result) {
                    var userName = result.name;
                    var userIcon = result.icon;
                    return renderHTMLComment(
                        userIcon,
                        userName,
                        time,
                        userComment
                    );
                }
            });
    }
    return result;
}

app.post("/handlePostComment", (req, res) => {
    var newsList = req.db.get("newsList");
    var userList = req.db.get("userList");

    var date = new Date(req.body.time);
    var time = date.toLocaleString();
    var userComment = req.body.new_comment;
    newsList.update(
        { _id: req.body.newsID },
        {
            $push: {
                comments: {
                    userID: req.cookies.userID,
                    time: date,
                    comment: userComment,
                },
            },
        }
    );
    userList.findOne({ _id: ObjectId(req.cookies.userID) }).then((result) => {
        if (result) {
            var userName = result.name;
            var userIcon = result.icon;
            res.send(renderHTMLComment(userIcon, userName, time, userComment));
        }
    });

    // res.send(req.body.new_comment);
});

function renderHTMLComment(userIcon, userName, time, userComment) {
    var res = `
    <div class="comment">
      <div class="icon_username">
        <img src="${userIcon}" width="20" height="20">
        <span>${userName}</span>
      </div>
      <p class="time">${time}</p>
      <p>${userComment}</p>
    </div>
  `;
    return res;
}

app.get("/login", (req, res) => {
    var newsID = req.query.newsID;
    var response = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>News Entry</title>
        <link rel="stylesheet" href="stylesheets/style.css">
        <script src="javascripts/script.js"></script>
      </head>
      <body>
      <section>
      <div id="container">
        <h1 id="message">You can login in here</h1>
        User Name: <input type="text" id="username"><br>
        Password: <input type="password"  id="password"><br>
        <input type="submit" value="Submit" onclick="login()">
      </div>
      </section>
      
      `;
    if (newsID == 0) {
        response += ` 
    <footer>
        <a href="/">Go back</a>
      </footer>`;
    } else {
        response += ` 
    <footer>
        <a href="/displayNewsEntry?newsID=${newsID}">Go back</a>
    </footer>`;
    }

    response += `
    </body>
    </html>`;
    res.send(response);
});

app.get("/handleLogin", (req, res) => {
    var name = req.query.username;
    var password = req.query.password;
    var userList = req.db.get("userList");
    userList.find({ name: name, password: password }).then((docs) => {
        if (docs.length > 0) {
            res.cookie("userID", docs[0]._id);
            res.send("login success");
        } else {
            res.send("Username is incorrect or Password is incorrect");
        }
    });
});

app.get("/handleLogout", (req, res) => {
    res.clearCookie("userID");
    res.send("logout success");
});
// launch the server with port 8081
var server = app.listen(8081, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("assignment1 listening at http://%s:%s", host, port);
});
