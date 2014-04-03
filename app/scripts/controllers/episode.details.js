'use strict';

angular.module('BSMashup.Webapp')
    .controller('EpisodeDetailsCtrl', function ($scope, episodeDetails, torrentsList) {

        $scope.episode = episodeDetails.episode;
        $scope.torrents = torrentsList;

        console.log(episodeDetails.episode);
        console.log(torrentsList);
    });
