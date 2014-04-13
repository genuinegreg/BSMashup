'use strict';

angular.module('BSMashup.Webapp')
    .controller('EpisodesCtrl', function ($scope, episodesList) {
        $scope.shows = episodesList.shows;
        $scope.$emit('breadcrumb', [
            ['Séries', '#/series/episodes'],
            ['Épisodes', '#/series/episodes']
        ]);
    });
