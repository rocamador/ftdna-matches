var execFile = require("child_process").execFile

var casper = require('casper').create({
    pageSettings: {
        loadImages: false,//The script is much faster when this field is set to false
        loadPlugins: false,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36'
    }
});

var kitNumber = casper.cli.get("kit");
var password = casper.cli.get("pass");
var name = casper.cli.get("name");

var fs = require('fs');
var myfile = kitNumber + "-" + name + "-matches.csv";

casper.start();

casper.thenBypassIf(function() {
    if (!kitNumber || !password || !name) {
        console.log('params: --kit=XXXXX --pass=YYYYY --nane=ZZZZZZ are mandatory');
    }
    return !kitNumber || !password || !name;
}, 7);

casper.thenOpen("https://www.familytreedna.com/sign-in", function() {
    console.log("FTDNA website opened");
    //console.log("Make a screenshot and save it as image1.png");
    //this.capture('image1.png');
});

casper.waitForSelector("form input[name='kitNumber']", function() {
    this.fillSelectors('form[name=userInfoForm]', {
        'input[name = kitNumber ]' : kitNumber,
        'input[name = password ]' : password
    }, true);
    console.log("Logging In... " + kitNumber);
    this.click('button#sign-in-btn');
});

casper.then( function() {
    this.wait(5000, function() {
      //console.log("Make a screenshot and save it as image2.png");
      //this.capture('image2.png');
    });
});

casper.thenOpen('https://www.familytreedna.com/', function() {
    this.download('https://www.familytreedna.com/my/family-finder-api/matchesCSV', myfile, 'GET');
    console.log('created ', myfile);
});

casper.run();
