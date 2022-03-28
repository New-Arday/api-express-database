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

module.exports = petsRouter;
