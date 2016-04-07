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
	var itemsProcessed = 0; //to make sure the callback is called when we're done operating with the snakes array
	var snakes = req.body;
	var collection = mongo.db().collection('snakes');
	console.log(snakes);
	var len = snakes.length;
	snakes.forEach(function (snake) {
		delete( snake.visible );
		if (!snake.hasOwnProperty("_id") && !snake.deleteItem) { //we insert snakes without an id
			delete( snake.deleteItem );
			collection
				.insert(snake, function (err) {
					if (err) {throw err;}
					itemsProcessed++;
					if(itemsProcessed === len) {
						return listSnakes(req, res); //we return the remaining snakes back
					}
				});
		} else {
			var id = new mongo.ObjectId(snake._id);
			if (snake.deleteItem) { // the snake is deleted if it's marked for deletion
				collection
					.removeOne({_id:id}, function (err) {
						if (err) {throw err;}
						itemsProcessed++;
						if(itemsProcessed === len) {
							return listSnakes(req, res);
						}
					});
			} else {
				delete( snake.deleteItem ); //these two properties are not necessary anymore
				delete( snake._id );
				collection
					.update({_id:id}, snake, function (err) {
						if (err) {throw err;}
						itemsProcessed++;
						if(itemsProcessed === len) {
							return listSnakes(req, res);
						}
					});
			}
		}
	});
	
});



module.exports = router;
