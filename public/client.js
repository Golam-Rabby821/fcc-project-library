// UPDATED client.js with modern book rendering
$(document).ready(function () {
	let items = [];
	let itemsRaw = [];

	// CHANGED: Load books and render with modern styling
	$.getJSON("/api/books", function (data) {
		itemsRaw = data;
		$.each(data, function (i, val) {
			// CHANGED: Use semantic HTML with proper classes and structure
			let commentText =
				val.commentcount === 0
					? '<span class="no-comments">No comments yet</span>'
					: '<span class="comment-badge">' +
					  val.commentcount +
					  " comment" +
					  (val.commentcount !== 1 ? "s" : "") +
					  "</span>";

			items.push(
				'<li class="bookItem" id="' +
					i +
					'">' +
					'<span class="book-title">' +
					val.title +
					"</span>" +
					commentText +
					"</li>",
			);
			return i !== 14;
		});

		// CHANGED: More books indicator with better styling
		if (items.length >= 15) {
			items.push(
				'<p class="more-books">📚 ...and ' +
					(data.length - 15) +
					" more books in your library!</p>",
			);
		}

		$("<ul/>", {
			class: "listWrapper",
			html: items.join(""),
		}).appendTo("#display");
	});

	// Book click handler - show details
	let comments = [];
	$("#display").on("click", "li.bookItem", function () {
		$("#detailTitle").html(
			"<b>" +
				itemsRaw[this.id].title +
				"</b> (id: " +
				itemsRaw[this.id]._id +
				")",
		);
		$.getJSON("/api/books/" + itemsRaw[this.id]._id, function (data) {
			comments = [];
			$.each(data.comments, function (i, val) {
				comments.push("<li>" + val + "</li>");
			});
			comments.push(
				'<br><form id="newCommentForm"><input type="text" id="commentToAdd" name="comment" placeholder="Add a new comment..."></form>',
			);
			comments.push(
				'<br><button class="addComment" id="' +
					data._id +
					'">Add Comment</button>',
			);
			comments.push(
				'<button class="deleteBook" id="' + data._id + '">Delete Book</button>',
			);
			$("#detailComments").html(comments.join(""));
		});
	});

	// CHANGED: Delete single book and refresh display
	$("#bookDetail").on("click", "button.deleteBook", function () {
		let bookId = this.id;
		$.ajax({
			url: "/api/books/" + bookId,
			type: "delete",
			success: function (data) {
				// Clear detail view
				$("#detailTitle").text(
					"📚 Select a book to see its details and comments",
				);
				$("#detailComments").html("");

				// CHANGED: Reload the book list to show updated state
				location.reload();
			},
		});
	});

	// Add comment handler
	$("#bookDetail").on("click", "button.addComment", function () {
		let newComment = $("#commentToAdd").val();
		$.ajax({
			url: "/api/books/" + this.id,
			type: "post",
			dataType: "json",
			data: $("#newCommentForm").serialize(),
			success: function (data) {
				comments.unshift(newComment);
				$("#detailComments").html(comments.join(""));
			},
		});
	});

	// CHANGED: Add new book and reload display
	$("#newBook").click(function (e) {
		e.preventDefault();
		$.ajax({
			url: "/api/books",
			type: "post",
			dataType: "json",
			data: $("#newBookForm").serialize(),
			success: function (data) {
				// CHANGED: Reload to show new book
				location.reload();
			},
		});
	});

	// CHANGED: Delete all books and clear display without page refresh
	$("#deleteAllBooks").click(function () {
		$.ajax({
			url: "/api/books",
			type: "delete",
			success: function (data) {
				// Clear the display
				$("#display").html("");
				// Clear book details
				$("#detailTitle").text(
					"📚 Select a book to see its details and comments",
				);
				$("#detailComments").html("");
			},
		});
	});
});
