var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');
module.exports = {
    getAll: function (req, res) {

        Movie.find({}).populate('actors').exec(function(err, movies){
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
    },
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },
    addActors: function (req, res) {
        Movie.findOne({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: req.body.id }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        });
    },
    removeActorFromMovie: function (req, res) {
        Movie.findOne({ _id: req.params.movieId }, function (err, movie) {

            for (let i = 0; i < movie.actors.length; i++){
                if (String(movie.actors[i]) === req.params.actorId){
                    movie.actors.splice(i,1);
                }
            }

            Movie.findOneAndUpdate({ _id: req.params.movieId }, movie, function (err, movie2) {
                if (err) return res.status(400).json(err);
                if (!movie2) return res.status(404).json();
                res.json(movie2);
            });
            
        })
        
    },
    getMoviesBetween: function(req,res){
        let x = []
        Movie.find(function (err, movies) {

            if (err) {return res.json(err);}

            for (let i = 0; i<movies.length;i++){
                if (movies[i].year >= req.params.year1 && movies[i].year <= req.params.year2){
                    x.push(movies[i])
                }

            }
            res.json(x)


        });
    },
    deleteBetween: function (req, res) {
        Movie.find(function (err, movies) {
            
            if (err) return res.status(400).json(err);

            for (let i = 0; i < movies.length; i++){
                console.log(movies[i]._id)
                if (movies[i].year >= req.body.year1 && movies[i].year <= req.body.year2){
                    
                    Movie.findOneAndRemove({ _id: movies[i].id }, function (err) {
                        if (err) return res.status(400).json(err);
                        
                    });

                }
            }
            res.json();
        });
    }

};