'use strict';

angular.module('BSMashup.Webapp')
    .controller('MainCtrl', function ($scope, $location, $window, episodesList) {

        console.log(episodesList.shows);
        $scope.shows = episodesList.shows;


    });
