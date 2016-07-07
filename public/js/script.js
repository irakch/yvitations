var quoter;
var $btn_quotGen = $('#quoteGen');
$btn_quotGen.hide();
$btn_quotGen.click(onQuoteGenClick);
$.ajax("/api/yvitations", {
	type    : 'GET',
	dataType: 'json',
	success : function (_quotes, textStatus, jqXHR) {
		console.log(_quotes);
		quoter = makeQuotesKeeper(_quotes);
		$btn_quotGen.show();
	},
	error   : function (req, status, err) {
		console.log('something went wrong', status, err);
	}
});

var shownQuote;
var $quote = $('#quote');
var $author = $('#author');

/* *  *  *  *  *  *  *  *  *  *  *  *  *  */
/*                ფუნქციები               */
/* *  *  *  *  *  *  *  *  *  *  *  *  *  */

function onQuoteGenClick() {
	var q4show = quoter.getQuote();
	shownQuote = q4show;
	$quote.text(q4show.text);
	$author.text(q4show.author);
	updateCounter(q4show.initialIndex);
}


function makeQuotesKeeper(q) {
	var _quotes = q.slice(0);
	_quotes.forEach(function (quote, ind) {
		quote.avg = avg(quote.stars);
		quote.initialIndex = ind;
	});
	// ასე იმიტომ ვაკეთებ, რომ არ გავწყვიტო რეფერნსი საწყის ცხრილთან და არ ამერიოს სათვალავი
	var indexes = q.map(function (elm, ind) {
		return ind
	});
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

function updateCounter(ind) {
	$.ajax({
		url: '/api/yvitations/' + ind,
		type: 'PUT',
		data: "0"
	});
}
