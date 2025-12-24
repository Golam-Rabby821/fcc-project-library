# Personal Library API

A small Express + MongoDB API for the freeCodeCamp Quality Assurance "Personal Library" project. Create books, add comments, list books, and delete entries.

## Features
- Create a book by title
- List all books with comment counts
- Add comments to a specific book
- Delete a single book or clear the entire collection
- FCC test harness compatible

## Tech Stack
- Node.js + Express
- MongoDB (native driver)
- Mocha + Chai (FCC tests)

## Setup

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB instance (local or cloud)

### Install
```bash
npm install
```

### Environment
Create a `.env` file (or copy `sample.env`) and set:
```
MONGO_URI=your_mongodb_connection_string
PORT=3000
NODE_ENV=development
```

### Run
```bash
npm start
```

### Dev (auto-reload)
```bash
npm run dev
```

## API Endpoints

### GET /api/books
Returns an array of books:
```json
[
  { "_id": "bookId", "title": "Book Title", "commentcount": 2 }
]
```

### POST /api/books
Create a book.
Body:
```json
{ "title": "Book Title" }
```
Response:
```json
{ "_id": "bookId", "title": "Book Title", "comments": [] }
```
Errors:
- `missing required field title`

### GET /api/books/:id
Returns a single book:
```json
{ "_id": "bookId", "title": "Book Title", "comments": ["comment1"] }
```
Errors:
- `no book exists`

### POST /api/books/:id
Add a comment.
Body:
```json
{ "comment": "Nice read" }
```
Errors:
- `missing required field comment`
- `no book exists`

### DELETE /api/books/:id
Deletes a book.
Response: `delete successful`

### DELETE /api/books
Deletes all books.
Response: `complete delete successful`

## FCC Testing
The FCC test runner loads when `NODE_ENV=test`. Example:
```bash
NODE_ENV=test npm start
```

## Project Structure
- `server.js` - app entry point
- `routes/api.js` - API routes
- `tests/` - FCC tests
- `views/index.html` - landing page

## Credits
- freeCodeCamp project boilerplate
