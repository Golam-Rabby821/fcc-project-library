/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const { ObjectId } = require("mongodb");

chai.use(chaiHttp);

let requester;
let bookId;
let missingId;

suite("Functional Tests", function () {
	suiteSetup(async function () {
		requester = chai.request(server).keepOpen();
		const res = await requester.post("/api/books").send({ title: "Test Book" });
		bookId = res.body && res.body._id ? res.body._id : null;
		missingId = new ObjectId().toString();
	});

	suiteTeardown(function () {
		requester.close();
	});
	/*
	 * ----[EXAMPLE TEST]----
	 * Each test should completely test the response of the API end-point including response status code!
	 */
	test("#example Test GET /api/books", async function () {
		const res = await requester.get("/api/books");
		assert.equal(res.status, 200);
		assert.isArray(res.body, "response should be an array");
		assert.isAtLeast(res.body.length, 1, "response should not be empty");
		assert.property(
			res.body[0],
			"commentcount",
			"Books in array should contain commentcount",
		);
		assert.property(
			res.body[0],
			"title",
			"Books in array should contain title",
		);
		assert.property(res.body[0], "_id", "Books in array should contain _id");
	});
	/*
	 * ----[END of EXAMPLE TEST]----
	 */

	suite("Routing tests", function () {
		suite(
			"POST /api/books with title => create book object/expect book object",
			function () {
				test("Test POST /api/books with title", async function () {
					const res = await requester
						.post("/api/books")
						.send({ title: "The Great Gatsby" });
					assert.equal(res.status, 200);
					assert.property(res.body, "title", "Book should contain title");
					assert.property(res.body, "_id", "Book should contain _id");
					assert.equal(res.body.title, "The Great Gatsby");
				});

				test("Test POST /api/books with no title given", async function () {
					const res = await requester.post("/api/books").send({});
					assert.equal(res.status, 200);
					assert.equal(res.text, "missing required field title");
				});
			},
		);

		suite("GET /api/books => array of books", function () {
			test("Test GET /api/books", async function () {
				const res = await requester.get("/api/books");
				assert.equal(res.status, 200);
				assert.isArray(res.body, "response should be an array");
			});
		});

		suite("GET /api/books/[id] => book object with [id]", function () {
			test("Test GET /api/books/[id] with id not in db", async function () {
				const res = await requester.get(`/api/books/${missingId}`);
				assert.equal(res.status, 200);
				assert.equal(res.text, "no book exists");
			});

			test("Test GET /api/books/[id] with valid id in db", async function () {
				const res = await requester.get(`/api/books/${bookId}`);
				assert.equal(res.status, 200);
				assert.property(res.body, "_id");
				assert.property(res.body, "title");
				assert.equal(res.body._id, bookId);
			});
		});

		suite(
			"POST /api/books/[id] => add comment/expect book object with id",
			function () {
				test("Test POST /api/books/[id] with comment", async function () {
					const res = await requester
						.post(`/api/books/${bookId}`)
						.send({ comment: "This is a great book!" });
					assert.equal(res.status, 200);
					assert.property(res.body, "_id");
					assert.property(res.body, "comments");
					assert.equal(res.body._id, bookId);
					assert.isArray(res.body.comments);
					assert.include(res.body.comments, "This is a great book!");
				});

				test("Test POST /api/books/[id] without comment field", async function () {
					const res = await requester
						.post(`/api/books/${bookId}`)
						.send({ comment: "" });
					assert.equal(res.status, 200);
					assert.equal(res.text, "missing required field comment");
				});

				test("Test POST /api/books/[id] with comment, id not in db", async function () {
					const res = await requester
						.post(`/api/books/${missingId}`)
						.send({ comment: "This is a great book!" });
					assert.equal(res.status, 200);
					assert.equal(res.text, "no book exists");
				});
			},
		);

		suite("DELETE /api/books/[id] => delete book object id", function () {
			test("Test DELETE /api/books/[id] with valid id in db", async function () {
				const res = await requester.delete(`/api/books/${bookId}`);
				assert.equal(res.status, 200);
				assert.equal(res.text, "delete successful");
			});

			test("Test DELETE /api/books/[id] with  id not in db", async function () {
				const res = await requester.delete(`/api/books/${missingId}`);
				assert.equal(res.status, 200);
				assert.equal(res.text, "no book exists");
			});
		});
	});
});
