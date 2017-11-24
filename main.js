var casper = require('casper').create();
var fs = require('fs');
var data = require('data.json');
var catalogue = [];

var urls = data.urls;

casper.start();

casper.each(urls, function (self, item, index) {
    self.thenOpen(item, function () {
        var title = this.getTitle();
        var results = this.evaluate(function () {
            var produits = document.querySelectorAll("#product_list li");
            var results = [];
            for (var i = 0; i < produits.length; i++) {
                var name = produits[i].querySelectorAll('h3')[0].innerText;
                var images = produits[i].querySelectorAll('img')[0].src;
                var modele = produits[i].querySelectorAll('a.series_title');
                var tableau = [];

                for (var indice = 0; indice < modele.length; indice++) {
                    var modeles = modele[indice].innerText;
                    tableau.push(modeles);
                }

                results.push({
                    name: name,
                    pictures: images,
                    series: tableau
                })
            }
            return results;
        });



        var currentItem = {
            'categories': title.substr(19),
            'modele': results
        }
        catalogue.push(currentItem);
        /*console.log(title);
        console.log(image);*/


    });
});
casper.run(function () {
    fs.write('./catalogue.json', JSON.stringify(catalogue, null, '\t'));
    this.exit();
});