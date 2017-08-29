var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Box = mongoose.model('Box');

//Get boxes
router.get('/boxes', function(req, res, next) {
	Box.find(function(err, boxes){
		if(err){ return next(err); }

		res.json(boxes);
	});
});

//Add a new box
router.post('/boxes', function(req, res, next) {
	var box = new Box(req.body);

	box.save(function(err, box){
		if(err) {return next(err); }

		res.json(box);
	});
});

// Preload box objects on routes with ':box'
router.param('box', function(req, res, next, id) {
  var query = Box.findById(id);

  query.exec(function (err, box){
    if (err) {return next(err); }
    if (!box) {return next(new Error('can\'t find box'));}
    req.box = box;
    return next();
  });
});

//Get a box
router.get('/boxes/:box', function(req, res) {
  res.json(req.box);
});

//Delete a box
router.delete('/boxes/:box/removeBox', function(req, res, next) {
	// console.log('(router) Box: ' + req.box._id);
	req.box.remove1( function(err) {
		if (err) { return next(err); }
		return res.sendStatus(204);
		// console.log('(router) Box removed');
	})
});

//Delete boxes
router.put('/boxes/removeBoxes', function(req, res, next) {
	console.log('(router) removeVal: ' + req.body.removeVal);
	Box.remove({ value: req.body.removeVal }, function(err) {
		if (err) { return next(err); }
		return res.sendStatus(204);
	})
});

//Change box value
router.put('/boxes/:box/changeValue', function(req, res, next) {
	// console.log('(Router) Box: ' + req.box);
	// console.log('(Router) req: ' + req.body.newValue);
	req.box.changeValue(req.body.newValue, function(err, box){
		if (err) { return next(err); }
		res.json(box);
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
