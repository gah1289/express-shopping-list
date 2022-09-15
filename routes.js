const express = require('express');
const router = new express.Router();
const ExpressError = require('./expressError');
const items = require('./fakeDb');

router.get('/', (req, res) => {
	console.log('router working');
	console.log(res);
});

router.get('/items', function(req, res) {
	if (items.length == 0) {
		throw new ExpressError('There are no items at this time.', 400);
	}
	res.json(items);
});

router.post('/items', function(req, res) {
	if (!req.body.name) throw new ExpressError('Name is required', 400);
	else if (!req.body.price) throw new ExpressError('Price is required', 400);
	const newItem = { name: req.body.name, price: req.body.price };
	items.push(newItem);
	return res.status(201).json(newItem);
});

router.get('/items/:name', function(req, res) {
	const foundItem = items.find((item) => item.name === req.params.name);
	if (foundItem === undefined) {
		throw new ExpressError('Item not found', 404);
	}
	res.json(foundItem);
});

router.patch('/items/:name', function(req, res) {
	const foundItem = items.find((item) => item.name === req.params.name);
	if (foundItem === undefined) {
		throw new ExpressError('Item not found', 404);
	}
	foundItem.name = req.body.name;
	res.json(foundItem);
});

router.delete('/items/:name', function(req, res) {
	const foundItem = items.findIndex((item) => item.name === req.params.name);
	console.log(foundItem);
	console.log('****************');
	if (foundItem === -1) {
		throw new ExpressError('Item not found', 404);
	}
	console.log(items);
	items.splice(foundItem, 1);
	res.json({ message: 'Deleted' });
});

module.exports = router;
