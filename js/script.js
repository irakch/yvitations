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
var shownQuote;
var $quote = $('#quote');
var $author = $('#author');
$('#quoteGen').click(onQuoteGenClick);


/* *  *  *  *  *  *  *  *  *  *  *  *  *  */
/*                ფუნქციები               */
/* *  *  *  *  *  *  *  *  *  *  *  *  *  */

function onQuoteGenClick() {
	var q4show = quoter.getQuote();
	shownQuote = q4show;
	$quote.text(q4show.text);
	$author.text(q4show.author);
	updateCounter()
}

function makeQuotesKeeper(q) {
	var _quotes = q.slice(0);
	_quotes.forEach(function (quote, ind) {
		quote.avg = avg(quote.stars);
		quote.initialIndex = ind;
	});
	// ასე იმიტომ ვაკეთებ, რომ არ გავწყვიტო რეფერნსი საწყის ცხრილთან და არ ამერიოს სათვალავი
	var indexes = q.map(function (elm, ind) {return ind});
	var _indexes = [];

	return {
		getQuote: function () {
			if (_indexes.length == 0) {
				_indexes = indexes.slice(0);
			}
			return _quotes[_indexes.splice(Math.floor(Math.random() * _indexes.length), 1)[0]];
		}
	};
	

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


function updateCounter () {
	//TODO : უნდა დაიხვეწოს, ერთდროულად თუ რამდენიმე კლიენტი უყურებს ციტატს, მთვლელი არასწორი იქნება
	var quoteInFireBase = quotesRef.child(shownQuote.initialIndex);
	quoteInFireBase.update({
		"viewed": ++shownQuote.viewed
	});
}
