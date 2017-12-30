// ===============================================================================
// LOAD DATA
// Link routes to data sources
//===============================================================================
var friendData = require('../data/friends.js');


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  //Get returns friendList

  app.get('/api/friends', function (req, res) {
    res.json(friendData);
  });

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // ---------------------------------------------------------------------------

  app.post('/api/friends', function (req, res) {
    var currentUser = req.body;

    for (var i = 0; i < currentUser.scores.length; i++) {
      if (currentUser.scores[i] == "1 (Strongly Disagree)") {
        currentUser.scores[i] = 1;
      } else if (currentUser.scores[i] == "5 (Strongly Agree)") {
        currentUser.scores[i] = 5;
      } else {
        currentUser.scores[i] = parseInt(currentUser.scores[i]);
      }
    }

    var differencesArray = [];

    for (var i = 0; i < friendData.length; i++) {

      var comparedFriend = friendData[i];
      var totalDifference = 0;

      for (var k = 0; k < comparedFriend.scores.length; k++) {
        var differenceOneScore = Math.abs(comparedFriend.scores[k] - currentUser.scores[k]);
        totalDifference += differenceOneScore;
      }

      differencesArray[i] = totalDifference;
    }

    var bestMatchNum = differencesArray[0];
    var bestFriendIndex = 0;

    for (var i = 1; i < differencesArray.length; i++) {
      if (differencesArray[i] < bestMatchNum) {
        bestMatchNum = differencesArray[i];
        bestFriendIndex = i;
      }
    }

    friendData.push(currentUser);

    res.json(friendData[bestFriendIndex]);
  })
};
