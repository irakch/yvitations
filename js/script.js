var quoter;
var quotes;
var quotesRef = new Firebase('https://ka-polit-quotes.firebaseio.com/quotes');
quotesRef.on("value", function (snapshot) {
	quotes = snapshot.val();
	if (!quoter) { //ამ ობიექტს ვქმნით მხოლოდ ბაზიდან პირველ პასუხზე
		quoter = makeQuotesKeeper(quotes);
	}
}, function (errorObject) {
	console.log("The read failed: " + errorObject.code);
});
var $quote = $('#quote');
var $author = $('#author');
var $stars = stars();
var shownQuote;
var resetDialog = $("#resetModal");
$("#reset").on("click", function () {
	quoter = makeQuotesKeeper(quotes);
	resetDialog.modal('hide');
});
$('#quoteGen').click(onQuoteGenClick);

/* *  *  *  *  *  *  *  *  *  *  *  *  *  */
/*                ფუნქციები               */
/* *  *  *  *  *  *  *  *  *  *  *  *  *  */

function onQuoteGenClick() {
	var q4show = quoter.getQuote();
	if(!q4show) {
		resetDialog.modal();
		shownQuote = null;
		return;
	}
	shownQuote = q4show;
	$quote.text(q4show.text);
	$author.text(q4show.author);
	highlightStars(q4show.avg);
	updateCounter()
}

function makeQuotesKeeper(q) {
	var _quotes = q.slice(0);
	_quotes.forEach(function (quote, ind) {
		quote.avg = avg(quote.stars);
		quote.initialIndex = ind;
	});
	return {
		getQuote: function () {
			return _quotes.splice(Math.floor(Math.random() * _quotes.length), 1)[0];
		}
	}
}

function avg(stars) {
	var score = 0;
	var stared = 0;
	stars.forEach(function (star, ind) {
		score += (ind + 1 ) * star;
		stared += star;
	});
	return Math.round(score / stared) || "0";
}


function stars() {
	var _stars = {};
	var i = 1;
	while (i < 6) {
		_stars[i] = $('#star-' + i);
		_stars[i].on("click", makeOnStarCkick(i - 1));
		++i;
	}
	return _stars;
	function makeOnStarCkick (rating) {
		return function onStarclick () {
			shownQuote.stars[rating]++;
			shownQuote.avg = avg(shownQuote.stars);
			highlightStars(shownQuote.avg);
			var quoteInFireBase = quotesRef.child(shownQuote.initialIndex);
			quoteInFireBase.update({
				"stars": shownQuote.stars
			});
		};
	}
}

function updateCounter () {
	var quoteInFireBase = quotesRef.child(shownQuote.initialIndex);
	quoteInFireBase.update({
		"viewed": ++shownQuote.viewed
	});
}
function highlightStars(score) {
	var i = 1;
	while (i < 6) {
		score < i ? $stars[i].blur() : $stars[i].focus();
		++i;
	}
}