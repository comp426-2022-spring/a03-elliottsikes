const express = require('express');
const app = express();

const args = require("minimist")(process.argv.slice(2))
args["port"]
const port = args.port || process.env.PORT || 5000

const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',port))
});

app.get('/app/flip/call/heads', (req, res) => {
    const result = flipACoin('heads');
    res.status(200).json({
        result
    })
});

app.get('/app/flip/call/tails', (req, res) => {
    const result = flipACoin('tails');
    res.status(200).json({
        result
    })
});

app.get('/app/flips/:number', (req, res) => {
    var num = req.params.number;
    const flips = coinFlips(num);
    const results = countFlips(flips);
    res.status(200).json({
        "raw": flips,
        "summary": results
    })
});

app.get('/app/flip/', (req, res) => {
    var result = coinFlip();
    res.status(200).json({
        "flip": result
    })
});

app.get('/app/', (req, res) => {
    // Respond with status 200
    res.statusCode = 200;
    // Respond with status message "OK"
    res.statusMessage = 'OK';
    res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
    res.end(res.statusCode+ ' ' +res.statusMessage)
});

app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
});


// COIN FUNCTIONS

function coinFlip() {
    let x = Math.random();
    if(x <= 0.49) {
      return "heads";
    } else {
      return "tails";
    }
}

function coinFlips(flips) {
    let flipCount = flips;
    const flipResults = new Array();
    while(flipCount>0) {
      flipResults.push(coinFlip());
      flipCount--;
    }
    return flipResults;
}

function countFlips(array) {
    let heads = 0, tails = 0;
    array.forEach(flip => {
      if (flip == 'heads') heads++;
      else tails++;
    });
    if (heads > 0 && tails > 0)
      return {
        'heads': heads,
        'tails': tails
      }
    if (heads > 0)
     return {
        'heads': heads
     };
  
    return {
      'tails': tails
    };
};

function flipACoin(call) {
    const correct = coinFlip();
    if(correct == call) {
      return {'call': call, 'flip': correct, 'result': 'win'};
    } else {
      return {'call': call, 'flip': correct, 'result': 'lose'};
    }
}