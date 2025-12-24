/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const { ObjectId } = require("mongodb");

module.exports = function (app, myDataBase) {
	app
		.route("/api/books")
		.get(async function (req, res) {
			//response will be array of book objects
			//json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
			try {
				const books = await myDataBase
					.find({})
					.project({ title: 1, comments: 1 })
					.toArray();

				const formatted = books.map((book) => ({
					_id: book._id,
					title: book.title,
					commentcount: Array.isArray(book.comments) ? book.comments.length : 0,
				}));

				return res.json(formatted);
			} catch (err) {
				return res.status(500).type("text").send("database error");
			}
		})

		.post(async function (req, res) {
			const title = req.body.title;
			if (!title) return res.send("missing required field title");

			try {
				const result = await myDataBase.insertOne({
					title: title,
					comments: [],
				});
				const book = await myDataBase.findOne({ _id: result.insertedId });
				return res.json(book);
			} catch (err) {
				return res.status(500).type("text").send("database error");
			}
		})

		.delete(async function (req, res) {
			try {
				await myDataBase.deleteMany({});
				return res.send("complete delete successful");
			} catch (err) {
				return res.status(500).type("text").send("database error");
			}
		});

	app
		.route("/api/books/:id")
		.get(async function (req, res) {
			const bookid = req.params.id;
			if (!ObjectId.isValid(bookid)) return res.send("no book exists");

			try {
				const book = await myDataBase.findOne({ _id: new ObjectId(bookid) });
				if (!book) return res.send("no book exists");
				if (!Array.isArray(book.comments)) book.comments = [];
				return res.json(book);
			} catch (err) {
				return res.status(500).type("text").send("database error");
			}
		})

		.post(async function (req, res) {
			const bookid = req.params.id;
			const comment = req.body.comment;
			if (!comment) return res.send("missing required field comment");
			if (!ObjectId.isValid(bookid)) return res.send("no book exists");

			try {
				const id = new ObjectId(bookid);
				const book = await myDataBase.findOne({ _id: id });
				if (!book) return res.send("no book exists");

				await myDataBase.updateOne(
					{ _id: id },
					{ $push: { comments: comment } },
				);
				const updated = await myDataBase.findOne({ _id: id });
				if (!Array.isArray(updated.comments)) updated.comments = [];
				return res.json(updated);
			} catch (err) {
				return res.status(500).type("text").send("database error");
			}
		})

		.delete(async function (req, res) {
			const bookid = req.params.id;
			if (!ObjectId.isValid(bookid)) return res.send("no book exists");

			try {
				const result = await myDataBase.deleteOne({
					_id: new ObjectId(bookid),
				});
				if (!result || result.deletedCount === 0)
					return res.send("no book exists");
				return res.send("delete successful");
			} catch (err) {
				return res.status(500).type("text").send("database error");
			}
		});
};
