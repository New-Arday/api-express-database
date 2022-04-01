//...........Set up step 1..............//
const express = require("express");

//...........Set up step 2..............//
const db = require("../utils/database");

//...........Set up step 3..............//
const booksRouter = express.Router();

//...........query - get ..............//
booksRouter.get("/", (req, res) => {
  db.query("SELECT * FROM books LIMIT 7 OFFSET 7")
    .then((databaseResult) => {
      console.log(databaseResult);
      res.json({ books: databaseResult.rows });
    })
    .catch((error) => {
      res.status(500);
      res.json({ error: "Unexpected Error" });
      console.log(error);
    });
});

//...........query - get by ID..............//

booksRouter.get("/:id", (req, res) => {
  const bookById = req.params.id;
  const selctBook = "SELECT * FROM books WHERE id=$1";
  db.query(selctBook, [bookById]).then((bookDbResult) => {
    console.log(bookDbResult);
    if (bookDbResult.rowCount === 0) {
      res.status(404);
      res.json({ error: "book not found" });
    } else {
      res.json({ book: bookDbResult.rows[0] });
    }
  });
});

//...........query - post ..............//
booksRouter.post("/", (req, res) => {
  //.....storing the INSERT INTO a variable....//
  const insertBookQuery = `INSERT INTO books
  (title,type,author,topic, publicationDate,pages) 
    VALUES($1,$2,$3,$4,$5,$6)
     RETURNING * `;
  //.....Capturing and Storing the value for each column name (which will match with the value given in the INSERT step -$) in a const variable.....//
  const bookValues = [
    req.body.title,
    req.body.type,
    req.body.author,
    req.body.topic,
    req.body.publicationDate,
    req.body.pages,
  ];

  //.... Make a query (fetch) of the INSERTED book and its value to the database tank by following the 'fetch style method'? ....//

  db.query(insertBookQuery, bookValues).then((newlyAddedBook) => {
    console.log(newlyAddedBook, "See book result");
    res.json({ newBook: newlyAddedBook.rows });
  });
});
//.........DELETE..........//
booksRouter.delete("/:id", (req, res) => {
  const deleteBookQuery = `DELETE FROM books WHERE id= $1 RETURNING * `;
  const deleteValues = [req.params.id];
  db.query(deleteBookQuery, deleteValues)
    .then((dbResults) => {
      res.json({ book: dbResults.rows[0] });
    })
    .catch((error) => {
      console.log(error);
      res.status(500);
      res.json({ error: "error" });
    });
});

//........ UPDATE ..........//

booksRouter.put("/:id", (req, res) => {
  const updateBookQuery = `
  UPDATE books SET
  title = $1,
  author = $2,
  topic = $3,
  publicationdate = $4,
  pages = $5
   WHERE id  = $6
   RETURNING *`;
  const updateValues = [
    req.body.title,
    req.body.author,
    req.body.topic,
    req.body.publicationdate,
    req.body.pages,
    req.params.id,
  ];

  db.query(updateBookQuery, updateValues)
    .then((dbResults) => {
      console.log(dbResults);
      if (dbResults.rowCount === 0) {
        res.status(404);
        res.json({ error: "error, book not found" });
        return;
      }
      res.json({ book: dbResults.rows[0] });
    })
    .catch((error) => {
      console.log(error);
      res.status(500);
      res.json({ error: "error" });
    });
});

//...........Set up step 4..............//
module.exports = booksRouter;
