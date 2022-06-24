// Filename: api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
Slam = require('./modelSlam');
// Handle index actions

router.get('/getSlams',function (req, res) {
    Slam.find({},function (err, Slams) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Slams retrieved successfully",
            data: Slams
        });
    });
});

//Handle Total revenue from director 
router.get('/getTotalRevenueForPlayer/:tennista', function (req, res) {
    Slam.aggregate([
        {$match: {WINNER: req.params.tennista}},
        { $group : {_id: "$WINNER", totale: { $sum : "$WINNER_PRIZE" }}}],function (err, total_revenue) {
        if (err) { 
            res.json({ 
                status: "error", 
                message: err, 
            }); 
        } 
        res.json({ 
            status: "success", 
            message: "Slams retrieved successfully",
            data: total_revenue 
        }); 
    }); 
});

//Handle worst worst movie for actor
router.get('/get_worst_movie_for_actor/:attore/:max_rating', function (req, res) { 
    var rating_inserito = parseInt(req.params.max_rating, 10); 
    Slam.find({RUNNER_UP:req.params.attore,RUNNER_UP_ATP_RANKING:{$gte:req.params.max_rating}},function (err, Films) {
        if (err) { 
            res.json({ 
                status: "error", 
                message: err, 
            }); 
        } 
        res.json({ 
             
            status: "success", 
            message: "Films retrieved successfully", 
            data: Films 
        }); 
    }); 
});

//ricerca slam per nome
router.get('/getSlamsForName/:name', function (req, res) {
    Slam.find({TOURNAMENT:req.params.name},function (err, Slams) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Slams retrieved successfully",
            data: Slams
        });
    });
});

//Handle average rating from director 
router.get('/getATPRankingForPlayers/:tennista', function (req, res) {
    Slam.aggregate([
        {$match: {WINNER: req.params.tennista}},
        { $group : {_id: "$WINNER", media: { $avg : "$WINNER_ATP_RANKING" }}}],function (err, Slams) {
        if (err) { 
            res.json({ 
                status: "error", 
                message: err, 
            }); 
        } 
        res.json({ 
            status: "success", 
            message: "Slams retrieved successfully",
            data: Slams
        }); 
    }); 
});


//ricerca film prodotti da un regista
router.get('/getWin/:tennista', function (req, res) {
    Slam.find({WINNER:req.params.tennista},function (err, Slams) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Slams retrieved successfully",
            data: Slams
        });
    });
});


//trovare i file prodotti in un range di anni
router.get('/getSlamsYearRange/:from_to', function (req, res) {
    var range=req.params.from_to.split('_');
    var from=parseInt(range[0]);
    var to=parseInt(range[1]);
    Slam.find({$and: [{YEAR:{$gte: from}}, {YEAR:{$lte: to}}]},function (err, Slams) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Slams retrieved successfully",
            data: Slams
        });
    });
});

//Numero di film prodotti in un range di anni e che corrispondono al genere specificato
router.get('/getFilmsYearsGenre/:genere/:from_to', function (req, res) {
    var range=req.params.from_to.split('_');
    var from=parseInt(range[0]);
    var to=parseInt(range[1]);
    Slam.aggregate([
            {$match:{TOURNAMENT_SURFACE:req.params.genere}},
            {$match:{$and:[{YEAR:{$gte: from}}, {YEAR:{$lte: to}}]}},
            {
                 $group: {
                       _id: "YEAR",
                       total: { $sum: 1 }
                   }
            }],function (err, Films) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Films retrieved successfully",
            data: Films
        });
    });
});

//Dato un range di anni e una tipologia di film, restituisce la somma degli incassi realizzati per singolo anno;
router.get('/getRevenue/:from_to/:tipologia', function (req, res) {
    var range=req.params.from_to.split('_');
    var from=parseInt(range[0]);
    var to=parseInt(range[1]);
    Slam.aggregate([
        {$match:{ $and: [{YEAR:{$gte: from}}, {YEAR:{$lte: to}}], WINNER:req.params.tipologia}},
        {$group:{ _id:"$YEAR", somma:{ $sum : "$WINNER_PRIZE" }}},
        {$sort : { _id : 1} }],function (err, Films) {
        if (err) { 
            res.json({ 
                status: "error", 
                message: err, 
            }); 
        } 
        res.json({ 
            status: "success", 
            message: "Films retrieved successfully", 
            data: Films 
        }); 
    }); 
});


// Handle genre actions 
router.get('/getFilmsForGenre/:genre',function(req, res){ 
    Film.find({Genre:req.params.genre},function(err, Films_for_genre) { 
        if (err) { 
            res.json({ 
                status: "error", 
                message: err, 
            }); 
        } 
        res.json({ 
            status: "success", 
            message: "Films retrieved successfully", 
            data: Films_for_genre 
        }); 
    }); 
});

// RESTITUISCE I REGISTI PRESENTI NEL DATASET 
router.get('/getTennisPlayers',function(req, res){
    Slam.aggregate([
        {$group:{ _id:"$WINNER"}}],function(err, Tennisti) {
        if (err) { 
            res.json({ 
                status: "error", 
                message: err, 
            }); 
        } 
        res.json({ 
            status: "success", 
            message: "Slams retrieved successfully",
            data: Tennisti
        }); 
    }); 
});

// RESTITUISCE I REGISTI PRESENTI NEL DATASET 
router.get('/getActors',function(req, res){ 
    Slam.aggregate([
        {"$unwind": "$RUNNER_UP" } ,
        { "$group": { _id: "$RUNNER_UP" } }],function(err, Actors) {
        if (err) { 
            res.json({ 
                status: "error", 
                message: err, 
            }); 
        } 
        res.json({ 
            status: "success", 
            message: "Films retrieved successfully", 
            data: Actors
        }); 
    }); 
});

// RESTITUISCE I Generi dei film PRESENTI NEL DATASET 
router.get('/getGenres',function(req, res){ 
    Slam.distinct("TOURNAMENT_SURFACE",function(err, Generi) {
        if (err) { 
            res.json({ 
                status: "error", 
                message: err, 
            }); 
        } 
        res.json({ 
            status: "success", 
            message: "Films retrieved successfully", 
            data: Generi
        }); 
    }); 
});

// RESTITUISCE I Generi dei film PRESENTI NEL DATASET
router.get('/getWinner',function(req, res){
    Slam.distinct("WINNER",function(err, Generi) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Films retrieved successfully",
            data: Generi
        });
    });
});





//handle best movie from rating and year 
router.get('/get_best_movie_for_rating_year/:anno/:rating', function (req, res) { 
    var rating_inserito = parseInt(req.params.rating, 10); 
    var anno_inserito = parseInt(req.params.anno, 10); 
    Slam.find({YEAR:anno_inserito, WINNER_ATP_RANKING:{$lte:rating_inserito}},function (err, Films) {
        if (err) {
            res.json({ 
                status: "error", 
                message: err, 
            }); 
        }
        res.json({ 
            status: "success", 
            message: "Films retrieved successfully", 
            data: Films 
        }); 
    });
});

router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!'
    });
});
// Export API routes
module.exports = router;