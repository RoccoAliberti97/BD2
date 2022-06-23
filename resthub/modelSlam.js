// contactModel.js
var mongoose = require('mongoose');
const {ObjectId} = require("mongoose/lib/types");
// Setup schema
var slamSchema = mongoose.Schema({
   
    _id: ObjectId,
    YEAR: Number,
    TOURNAMENT: String,
    WINNER: String,
    RUNNER_UP: String,
    WINNER_NATIONALITY: String,
    WINNER_ATP_RANKING: Number,
    RUNNER_UP_ATP_RANKING: Number,
    WINNER_LEFT_OR_RIGHT_HANDED: String,
    TOURNAMENT_SURFACE: String,
    WINNER_PRIZE: Number
});

// Export Contact model
var Slam = module.exports = mongoose.model('slam', slamSchema,'slam');


