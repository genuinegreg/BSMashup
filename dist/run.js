'use strict';

var connect = require('connect'),
    http = require('http'),
    url = require('url'),
    cors = require('cors'),
    proxy = require('proxy-middleware');


var app = connect().
    use(cors()).
    use('/betaseries', proxy(url.parse('https://api.betaseries.com'))).
    use(connect.static(__dirname + '/'));

//http.createServer(app).listen(9293);

app.listen(9293);