var express = require('express');
var router = express.Router();
var mongo = require('../database');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Snakes' });
});

router.post('/api/snakes', function(req, res) {
	mongo.db()
		.collection('snakes')
		.find()
		.toArray(function (err, docs) {
			if (err) {throw err;}
			res.json(docs);
		});
});

router.post('/api/snakes/save', function(req, res) {
	var snakes = req.body;
	snakes.forEach(function (snake) {
		delete( snake.visible );
		if (!snake.hasOwnProperty("_id") && !snake.del) { //we insert snakes without an id
			delete( snake.del );
			mongo.db()
				.collection('snakes')
				.insert(snake, function (err) {
					if (err) {throw err;}
				});
		} else {
			var id = new mongo.ObjectId(snake._id);
			if (snake.del) { // the snake is deleted if it's marked for deletion
				mongo.db()
					.collection('snakes')
					.removeOne({_id:id}, function (err) {
						if (err) {throw err;}
					});
			} else {
				delete( snake.del ); //these two properties are not necessary anymore
				delete( snake._id );
				mongo.db()
					.collection('snakes')
					.update({_id:id}, snake, function (err) {
						if (err) {throw err;}
					});
			}
		}
	});
	
});

module.exports = router;
