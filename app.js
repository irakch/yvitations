/**
 * Created by vk on 24.04.16.
 */
var bAppLaunched = false;
var Firebase = require('firebase');
var quotesRef = new Firebase('https://ka-polit-quotes.firebaseio.com/quotes');
var quotes = [];
var counter = makeCounter();
quotesRef.on("value", onFbValue, onFbError);

var express = require('express');
var app = express();

app.use(express.static('./public'));
app.get('/api/yvitations', function (req, res) {
	res.json(quotes);
});
app.put('/api/yvitations/:id', function (req, res) {
	counter.count(req.params.id);
});


/* *  *  *  *  *  *  *  *  *  *  *  *  *  */
/*                ფუნქციები               */
/* *  *  *  *  *  *  *  *  *  *  *  *  *  */

function onFbValue(snapshot) {
	quotes.splice(0); // ვცლი სიას, მაგრამ ვინარჩუნებ რეფერენსს
	snapshot.val().forEach(function (yvi, ind) {
		yvi.fb_index = ind;
		quotes.push(yvi);
	});
	if (!bAppLaunched) {
		app.listen(3000, function () {
			bAppLaunched = true;
			console.log('ყვიტატები ამოქოქილია პორტზე 3000!');
		});
	}
}

function onFbError(errorObject) {
	console.error("ვერ მოხერხდა ბაზასთან დაკავშირება " + errorObject.code);
}

function makeCounter() {
	var intervalSet = false;
	return {
		count: function (ind) {
			if (quotes[ind]) {
				++quotes[ind].viewed;
			}
			if (!intervalSet) {
				setInterval(updateFb, 60 * 60 * 1000); // საათში ერთხელ ვაახლებ თვლის მონაცემებს ფიარბეიზში
				intervalSet = true;
			}
		}
	};
	function updateFb() {
		quotes.forEach(function (yvitata) {
			var quoteInFireBase = quotesRef.child(yvitata.fb_index);
			quoteInFireBase.update({
				"viewed": yvitata.viewed
			});
		});
	}

}
