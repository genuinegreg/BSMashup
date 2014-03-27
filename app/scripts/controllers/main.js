'use strict';

angular.module('BSMashup.Webapp')
    .controller('MainCtrl', function (BetaSeries, $scope, $route, $location, $window, episodesList) {
        $scope.shows = episodesList.shows;
        $scope.logout = BetaSeries.logout;

    });
