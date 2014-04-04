'use strict';

angular.module('BSMashup.Webapp')
    .controller('ShowDetailsCtrl', function ($scope, showDetails, episodesList) {
        $scope.show = showDetails.show;
        $scope.unseen = episodesList.shows[0].unseen;

        $scope.$emit('breadcrumb', [
            ['Séries', '#/series/episodes'],
            [showDetails.show.title, '#/series/' + showDetails.show.id]
        ]);
    });
