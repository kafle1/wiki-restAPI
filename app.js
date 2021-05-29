const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")

  /// Request Targeting all Articlles ///////////////////////////////////

  .get(function (req, res) {
    Article.find(function (error, foundArticles) {
      if (!error) {
        res.send(foundArticles);
      } else {
        res.send(error);
      }
    });
  })

  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (error) {
      if (!error) {
        res.send("Succesfully added a new article!");
      } else {
        res.send(error);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (error) {
      if (!error) {
        res.send("Succesfully Deleted all the articles!");
      } else {
        res.send(error);
      }
    });
  });

/// Request Targeting A specific Articlles ///////////////////////////////////

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (error, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No any article found with that title!");
        }
      }
    );
  })

  .put(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (error) {
        if (!error) {
          res.send("Successfully updated article!");
        } else {
          res.send(error);
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (error) {
        if (!error) {
          res.send("Succesfully updated article!");
        } else {
          res.send(error);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (error) {
      if (!error) {
        res.send("Article was deleted successfully!");
      } else {
        res.send(error);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
