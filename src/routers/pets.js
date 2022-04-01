//...........Set up step 1..............//
const express = require("express");
const { json } = require("express/lib/response");

//...........Set up step 2..............//
const db = require("../utils/database");

//...........Set up step 3..............//
const petsRouter = express.Router();

//...........query - get ..............//
petsRouter.get("/", (req, res) => {
  const selectAllPetsQuery = "SELECT * FROM pets";

  const selectValue = [];
  const queries = [];

  if (req.query.page) {
    queries.push({ column: "page", value: req.query.page });
  }

  db.query(selectAllPetsQuery)
    .then((databaseResult) => {
      console.log(databaseResult);
      res.json({ pets: databaseResult.rows });
    })
    .catch((error) => {
      res.status(500);
      res.json({ error: "Unexpected Error" });
      console.log(error);
    });
});

petsRouter.get("/:id", (req, res) => {
  //...find and GET single id...//
  //...SELECT * FROM pets WHERE id = req.params.id
  const selectPetQuery = `SELECT * FROM pets
  WHERE id=$1`;
  // console.log(selectPetQuery);
  // res.send("testing 123");
  db.query(selectPetQuery, [req.params.id])
    .then((resDatabase) => {
      // if PETid that doesn't exist
      if (resDatabase.rowCount === 0) {
        res.status(404);
        res.json({ error: "Pet does not exist" });
      } else {
        console.log(resDatabase);
        res.json({ pets: resDatabase.rows[0] });
      }
    })
    .catch((erorr) => {
      res.status(500);
      res.json({ error: "Error" });
      console.log(erorr);
    });
});

//... adding a new pet..../

petsRouter.post("/", (req, res) => {
  const inserPet = `INSERT INTO pets(name,age,type,breed,microchip) VALUES($1,$2,$3,$4,$5) RETURNING * `;
  const petValue = [
    req.body.name,
    req.body.age,
    req.body.type,
    req.body.breed,
    req.body.microchip,
  ];
  db.query(inserPet, petValue).then((petResult) => {
    console.log(petResult);
    res.json({ pet: petResult[0] });
  });
});

petsRouter.delete("/:id", (req, res) => {
  const deletePetQuery = `DELETE FROM pets WHERE id= $1 RETURNING * `;
  const deleteValues = [req.params.id];
  db.query(deletePetQuery, deleteValues)
    .then((dbResults) => {
      res.json({ pet: dbResults.rows[0] });
    })
    .catch((error) => {
      console.log(error);
      res.status(500);
      res.json({ error: "error" });
    });
});

petsRouter.put("/:id", (req, res) => {
  const updatePetQuery = `
  UPDATE pets SET
   name = $1,
   age = $2,
   type = $3,
   breed = $4,
   microchip = $5
   WHERE id  = $6
   RETURNING *`;

  const updateValues = [
    req.body.name,
    req.body.age,
    req.body.type,
    req.body.breed,
    req.body.microchip,
    req.params.id,
  ];

  db.query(updatePetQuery, updateValues)
    .then((dbResults) => {
      console.log(dbResults);
      if (dbResults.rowCount === 0) {
        res.status(404);
        res.json({ error: "error, pet not found" });
        return;
      }
      res.json({ pet: dbResults.rows[0] });
    })
    .catch((error) => {
      console.log(error);
      res.status(500);
      res.json({ error: "error" });
    });
});

// SELECT select_list
//     FROM table_expression
//     [ ORDER BY ... ]
//     [ LIMIT { number | ALL } ] [ OFFSET number ]

const setPageLimit = `SELECT * FROM pets LIMIT 12 OFFSET 5`;

module.exports = petsRouter;
