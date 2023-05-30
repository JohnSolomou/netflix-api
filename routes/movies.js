const router = require("express").Router();
const Movie = require("../model/Movie");
const verify = require("../verifyToken");

//create
router.post("/", verify, async (req, res) => {
  if (req.user?.isAdmin) {
    const newMovie = new Movie(req.body);
    try {
      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("not allowed");
  }
});
//update
router.put("/:id", verify, async (req, res) => {
  if (req.user?.isAdmin) {
    try {
      const updateMovie = await Movie.findByIdAndUpdate(
        req.body.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateMovie);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("not allowed");
  }
});

//delete
router.delete("/:id", verify, async (req, res) => {
  if (req.user?.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.body.id);
      res.status(200).json("the movie has been deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("not allowed");
  }
});

//Get
router.get("/find/:id", verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get random movie
router.get("/random", verify, async (req, res) => {
  const type = req.query.type;
  let movie;

  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get all
router.get("/", verify, async (req, res) => {
  if (req.user?.isAdmin) {
    try {
      const movies = await Movie.find();
      res.status(200).json(movies.reverse());
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("not allowed");
  }
});

module.exports = router;
