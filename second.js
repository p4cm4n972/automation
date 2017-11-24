var casper = require('casper').create();
var fs = require('fs');
var data = require('data.json');
var product = [];
var gamme;

var urls = data.urls;

casper.start();

casper.each(urls, function(self, item, index) {
    self.thenOpen(item, function() {
        var title = this.getTitle();
        var gamme = this.evaluate(function () {     
            var targetElement =  document.querySelectorAll("#product_list  h3");
            var gamme = [];
           for (var index = 0; index < targetElement.length; index++) {
               var currentEl = targetElement[index].innerText;
               gamme.push(currentEl);
            };
            return gamme;
        });
       var image =  this.evaluate(function () {
           return $("#product_list > li > img:first").attr('src');
        });
        var currentItem = {
            'titre': title.substr(0,19),
            'gammes': gamme,
            'image src': image
        }
        product.push(currentItem);
        /*console.log(title);
        console.log(image);*/
        
    });
});
casper.run(function() {
    fs.write('./product-ORINGNET.json', JSON.stringify(product, null, '\t'));
    this.exit();
});