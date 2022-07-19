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
router.get('/get_worst_winner/:tennista/:max_rating', function (req, res) {
    Slam.find({WINNER:req.params.tennista,WINNER_ATP_RANKING:{$gte:req.params.max_rating}},function (err, Slams) {
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

//Handle worst worst movie for actor
router.get('/get_worst_runner_up/:tennista/:max_rating', function (req, res) {
    var rating_inserito = parseInt(req.params.max_rating, 10);
    Slam.find({RUNNER_UP:req.params.tennista,RUNNER_UP_ATP_RANKING:{$gte:req.params.max_rating}},function (err, Slams) {
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
router.get('/getSlamsYearsNationality/:nazione/:from_to', function (req, res) {
    var range=req.params.from_to.split('_');
    var from=parseInt(range[0]);
    var to=parseInt(range[1]);
    Slam.aggregate([
            {$match:{WINNER_NATIONALITY:req.params.nazione}},
            {$match:{$and:[{YEAR:{$gte: from}}, {YEAR:{$lte: to}}]}},
            {
                 $group: {
                       _id: "$YEAR",
                       total: { $sum: 1 }
                   }
            },{$sort : { _id : 1} }],function (err, Slams) {
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

//Dato un range di anni e una tipologia di film, restituisce la somma degli incassi realizzati per singolo anno;
router.get('/getRevenue/:from_to/:tennista', function (req, res) {
    var range=req.params.from_to.split('_');
    var from=parseInt(range[0]);
    var to=parseInt(range[1]);
    Slam.aggregate([
        {$match:{ $and: [{YEAR:{$gte: from}}, {YEAR:{$lte: to}}], WINNER:req.params.tennista}},
        {$group:{ _id:"$YEAR", somma:{ $sum : "$WINNER_PRIZE" }}},
        {$sort : { _id : 1} }],function (err, Slams) {
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
router.get('/getRunner_Up',function(req, res){
    Slam.aggregate([
        { "$group": { _id: "$RUNNER_UP" } }],function(err, Runner_Up) {
        if (err) { 
            res.json({ 
                status: "error", 
                message: err, 
            }); 
        } 
        res.json({ 
            status: "success", 
            message: "Runner_Up retrieved successfully",
            data: Runner_Up
        }); 
    }); 
});

// RESTITUISCE I Generi dei film PRESENTI NEL DATASET 
router.get('/getNationality',function(req, res){
    Slam.distinct("WINNER_NATIONALITY",function(err, Nazione) {
        if (err) { 
            res.json({ 
                status: "error", 
                message: err, 
            }); 
        } 
        res.json({ 
            status: "success", 
            message: "Nation retrieved successfully",
            data: Nazione
        }); 
    }); 
});

// RESTITUISCE I Generi dei film PRESENTI NEL DATASET
router.get('/getWinner',function(req, res){
    Slam.distinct("WINNER",function(err, Winner) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Winner retrieved successfully",
            data: Winner
        });
    });
});





//handle best movie from rating and year 
router.get('/get_best_ranking_for_winner_year/:anno/:ranking', function (req, res) {
    var rating_inserito = parseInt(req.params.ranking, 10);
    var anno_inserito = parseInt(req.params.anno, 10); 
    Slam.find({YEAR:anno_inserito, WINNER_ATP_RANKING:{$lte:rating_inserito}},function (err, Slams) {
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

//handle best movie from rating and year
router.get('/get_best_ranking_for_runner_up_year/:anno/:ranking', function (req, res) {
    var rating_inserito = parseInt(req.params.ranking, 10);
    var anno_inserito = parseInt(req.params.anno, 10);
    Slam.find({YEAR:anno_inserito, RUNNER_UP_ATP_RANKING:{$lte:rating_inserito}},function (err, Slams) {
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
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!'
    });
});
// Export API routes
module.exports = router;