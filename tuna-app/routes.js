//SPDX-License-Identifier: Apache-2.0

var network = require('./controller.js');

module.exports = function(app){
  
  app.get('/get_all_consultants', function(req, res){
    network.get_all_consultants(req, res); 
  });
  app.get('/add_consultant/:consultant', function(req, res){
    network.add_consultant(req, res);
  });
  app.get('/get_consultant/:id', function(req, res){
    network.get_consultant(req, res);
  });
  app.get('/change_holder/:holder', function(req, res){
    network.change_holder(req, res);
  });
}
