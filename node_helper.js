/* Magic Mirror
 * Module: Pollen allergies
 *
 */
var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({

  start: function () {
    console.log('MMM-Pollen-fr helper started ...');
  },

  getData: function (url) {
      var self = this;
      console.log('requesting:' + url);
      request({ url: url, headers: {'Referer' : url}, method: 'GET' }, function (error, response, body) {
          if (!error && response.statusCode == 200) {
              console.log("MMM-Pollen-FR : loading data...");
              var result = JSON.parse(body);
              self.sendSocketNotification('POLLEN_RESULT', result);
          } else {
              console.log("MMM-Pollen-FR : Could not load data.");
          }
      });
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(payload) {
     this.getData(payload);
  }
});