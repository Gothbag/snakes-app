var express = require('express');
var router = express.Router();
var mongo = require('../database');

var listSnakes = function(req, res) {
	mongo.db()
		.collection('snakes')
		.find()
		.toArray(function (err, docs) {
			if (err) {throw err;}
			res.json(docs);
	});
}


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Snakes' });
});

router.post('/api/snakes', listSnakes);

router.post('/api/snakes/save', function(req, res) {
	var itemsProcessed = 0; //this is so that when all items are processed, we can send them back
	var snakes = req.body;
	var collection = mongo.db().collection('snakes');
	var len = snakes.length;
	snakes.forEach(function (snake) {
		if (snake.hasOwnProperty("_id")) { snake._id = new mongo.ObjectId(snake._id);} //Knockout sends items without an ObjectId
		if (!snake.deleteItem) { //we add/update the snakes that are not marked for deletion
			delete( snake.deleteItem ); //we don't need these fields anymore
			delete( snake.visible );
				collection.save(snake, function (err) {
					if (err) {throw err;}
					itemsProcessed++;
					if(itemsProcessed === len) {
						return listSnakes(req, res); //we return the updated snakes
					}
				});
		} else { //items marked for deletion
			collection.removeOne({_id: snake._id}, function (err) {
					if (err) {throw err;}
					itemsProcessed++;
					if(itemsProcessed === len) {
  						return listSnakes(req, res);
					}
				}); 
		}
	});
	
});

module.exports = router;
