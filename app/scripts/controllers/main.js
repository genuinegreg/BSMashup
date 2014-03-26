'use strict';

angular.module('BSMashup.Webapp')
    .controller('MainCtrl', function (Betaseries, $scope, $route, $location, $window, episodesList) {
        $scope.shows = episodesList.shows;
        $scope.logout = Betaseries.logout;

    });
