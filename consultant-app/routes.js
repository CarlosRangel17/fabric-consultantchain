//SPDX-License-Identifier: Apache-2.0

var network = require('./controller.js');

module.exports = function(app){
  
  app.get('/get_all_consultants', function(req, res){
    network.get_all_consultants(req, res); 
  });
  // app.get('/get_all_sows', function(req, res){
  //   network.get_all_sows(req, res); 
  // });
  app.get('/add_consultant', function(req, res){
    // var consultant = req.query.consultant;
    // console.log('Attempting to add consultant: { consultant: ', consultant, '}');
    network.add_consultant(req, res);
  });
  app.get('/get_consultant/:id', function(req, res){
    network.get_consultant(req, res);
  });
  app.get('/change_holder/:holder', function(req, res){
    network.change_holder(req, res);
  });
  app.get('/request_consultant/:sow', function(req, res){
    network.request_consultant(req, res);
  });
  app.get('/get_all_sows', function(req, res) {
    console.log('[routes.js] get all sows requested');
    network.get_all_sows(req, res);
  });
}
