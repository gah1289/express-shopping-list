process.env.NODE_ENV = 'test';
const request = require('supertest');

const app = require('./app');
let items = require('./fakeDb');

let shoppingItems = [
	{
		name  : 'popsicle',
		price : 1.45
	},
	{
		name  : 'cheerios',
		price : 3.4
	}
];

beforeEach(function() {
	for (let item of shoppingItems) {
		items.push(item);
	}
});
afterEach(() => (items.length = 0));

describe('GET /items', () => {
	test('Get all items', async () => {
		const res = await request(app).get('/items');
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(shoppingItems);
	});
});

describe('POST /items', () => {
	test('Post items', async () => {
		const res = await request(app).post('/items').send({
			name  : 'milk',
			price : 3.99
		});
		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual({ name: 'milk', price: 3.99 });
	});

	test('Post items without name', async () => {
		const res = await request(app).post('/items').send({
			price : 3.99
		});
		expect(res.statusCode).toBe(400);
		expect(res.body).toEqual({
			error : 'Name is required'
		});
	});

	test('Post items without price', async () => {
		const res = await request(app).post('/items').send({
			name : 'milk'
		});
		expect(res.statusCode).toBe(400);
		expect(res.body).toEqual({
			error : 'Price is required'
		});
	});
});

describe('GET /items/:name', () => {
	test('Get item by name', async () => {
		const res = await request(app).get(`/items/${shoppingItems[0].name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual(shoppingItems[0]);
	});
	test('Responds with 404 for invalid item', async () => {
		const res = await request(app).get(`/items/melk`);
		expect(res.statusCode).toBe(404);
	});
});

describe('PATCH /items/:name', () => {
	test("Updating an item's name", async () => {
		const res = await request(app).patch(`/items/popsicle`).send({ name: 'fudgesicle' });
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ name: 'fudgesicle', price: 1.45 });
	});
	test('Responds with 404 for invalid name', async () => {
		const res = await request(app).patch(`/items/melk`).send({ name: 'milk' });
		expect(res.statusCode).toBe(404);
	});
});

describe('DELETE /items/:name', () => {
	test('Deleting an item', async () => {
		const res = await request(app).delete(`/items/${shoppingItems[0].name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: 'Deleted' });
	});
	test('Responds with 404 for deleting invalid item', async () => {
		const res = await request(app).delete(`/items/melk`);
		expect(res.body).toEqual({ error: 'Item not found' });
	});
});
