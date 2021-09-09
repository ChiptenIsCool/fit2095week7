//https://hub.packtpub.com/building-movie-api-express/
const express = require('express');
const mongoose = require('mongoose');
const actors = require('./routers/actorrouter');
const movies = require('./routers/movierouter');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoose.connect('mongodb://localhost:27017/movies', function (err) {
    if (err) {
        return console.log('Mongoose - connection error:', err);
    }
    console.log('Connect Successfully');
});
//Configuring Endpoints
//Actor RESTFul endpoionts 
app.get('/actors', actors.getAll);
app.post('/actors', actors.createOne);
app.get('/actors/:id', actors.getOne);
app.put('/actors/:id', actors.updateOne);
app.post('/actors/:id/movies', actors.addMovie);
app.delete('/actors/:id', actors.deleteOne);
app.put('/actors/:actorId/:movieId', actors.removeMovieFromActor);
app.delete('/actors/anddeleteallmovies/:id', actors.deleteActorAndMovie);


//Movie RESTFul  endpoints
app.get('/movies', movies.getAll);
app.post('/movies', movies.createOne);
app.get('/movies/:id', movies.getOne);
app.put('/movies/:id', movies.updateOne);
app.delete('/movies/:id', movies.deleteOne);
app.post('/movies/:id/actors', movies.addActors);
app.put('/movies/:movieId/:actorId', movies.removeActorFromMovie);
app.get('/movies/getbetween/:year1/:year2', movies.getMoviesBetween)
app.delete('/movies/deletebetween/:year1/:year2', movies.deleteBetween)


app.listen(8080);