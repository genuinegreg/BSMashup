'use strict';

angular.module('BSMashup.Webapp')
    .controller('EpisodesCtrl', function ($scope, episodesList) {

        console.log(episodesList.shows);
        $scope.shows = episodesList.shows;
    });
