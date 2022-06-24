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
            message: "Films retrieved successfully",
            data: Slams
        });
    });
});

//Handle Total revenue from director 
router.get('/getTotalRevenueForDirector/:regista', function (req, res) { 
    Film.aggregate([ 
        {$match: {Director: req.params.regista}}, 
        { $group : {_id: "$Director", totale: { $sum : "$Revenue" }}}],function (err, total_revenue) { 
        if (err) { 
            res.json({ 
                status: "error", 
                message: err, 
            }); 
        } 
        res.json({ 
            status: "success", 
            message: "Films retrieved successfully", 
            data: total_revenue 
        }); 
    }); 
});

router.get('/getTotalMetascoreForDirector/:regista', function (req, res) { 
    Film.aggregate([ 
        {$match: {Director: req.params.regista}}, 
        { $group : {_id: "$Director", totale: { $sum : "$Metascore" }}}],function (err, total_revenue) { 
        if (err) { 
            res.json({ 
                status: "error", 
                message: err, 
            }); 
        } 
        res.json({ 
            status: "success", 
            message: "Films retrieved successfully", 
            data: total_revenue 
        }); 
    }); 
});

//Handle worst worst movie for actor
router.get('/get_worst_movie_for_actor/:attore/:max_rating', function (req, res) { 
    var rating_inserito = parseInt(req.params.max_rating, 10); 
    Film.find({Actors:req.params.attore,Rating:{$lte:req.params.max_rating}},function (err, Films) { 
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
router.get('/getAVGRatingForDirector/:regista', function (req, res) { 
    Film.aggregate([ 
        {$match: {Director: req.params.regista}}, 
        { $group : {_id: "$Director", media: { $avg : "$Rating" }}}],function (err, Films) { 
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


//ricerca film prodotti da un regista
router.get('/getFilmDirector/:regista', function (req, res) {
    Film.find({Director:req.params.regista},function (err, Films) {
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
            {$match:{Genre:req.params.genere}},
            {$match:{$and:[{Year:{$gte: from}}, {Year:{$lte: to}}]}},
            {
                 $group: {
                       _id: "$Year",
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
    Film.aggregate([ 
        {$match:{ $and: [{Year:{$gte: from}}, {Year:{$lte: to}}], Genre:req.params.tipologia}},
        {$sort : { Year : -1} },
        {$group:{ _id:"$Year", somma:{ $sum : "$Revenue" }}}],function (err, Films) { 
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
router.get('/getDirectors',function(req, res){ 
    Film.aggregate([ 
        {$group:{ _id:"$Director"}}],function(err, Directors) { 
        if (err) { 
            res.json({ 
                status: "error", 
                message: err, 
            }); 
        } 
        res.json({ 
            status: "success", 
            message: "Films retrieved successfully", 
            data: Directors 
        }); 
    }); 
});

// RESTITUISCE I REGISTI PRESENTI NEL DATASET 
router.get('/getActors',function(req, res){ 
    Film.aggregate([ 
        {"$unwind": "$Actors" } ,
        { "$group": { _id: "$Actors" } }],function(err, Actors) { 
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
    Slam.distinct("Genre",function(err, Generi) {
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
    Film.find({Year:anno_inserito, Rating:{$gte:rating_inserito}},function (err, Films) { 
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