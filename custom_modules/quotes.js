/**
 * Created by vk on 24.04.16.
 */
var Firebase = require('firebase');
var quotesRef = new Firebase('https://ka-polit-quotes.firebaseio.com/quotes');
var quotes = global.quotes = [];
quotesRef.on("value", function (snapshot) {
	quotes = quotes.splice(0); // ვცლი სიას, მაგრამ ვინარჩუნებ რეფერენსს
	snapshot.val().forEach(function (yvi) {
		quotes.push(yvi);
	});
}, function (errorObject) {
	console.log("The read failed: " + errorObject.code);
});

module.exports = quotes;