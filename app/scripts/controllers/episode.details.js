'use strict';

angular.module('BSMashup.Webapp')
    .controller('EpisodeDetailsCtrl', function ($scope, episodeDetails, torrentsList, BetaSeries) {

        $scope.episode = episodeDetails.episode;
        $scope.torrents = torrentsList;

        /* jshint camelcase:false */
        $scope.$emit('breadcrumb', [
            ['Séries', '#/series/episodes'],
            [episodeDetails.episode.show_title, '#/series/' + episodeDetails.episode.show_id],
            [episodeDetails.episode.code + ' - ' + episodeDetails.episode.title,
                    '#/series/' + episodeDetails.episode.show_id + '/episode/' + episodeDetails.episode.id]

        ]);
        /* jshint camelcase:true */


        var episodes = BetaSeries.rest.all('episodes');
        var subtitles = BetaSeries.rest.all('subtitles');

        $scope.setDownloaded = function (ep) {
            NProgress.start();

            var promise;
            if (!ep.user.downloaded) {
                promise = episodes.postDownloaded({}, {id: ep.id});
            }
            else {
                promise = episodes.removeDownloaded({}, {id: ep.id});
            }

            return promise
                .then(function () {
                    ep.user.downloaded = !ep.user.downloaded;
                })
                .finally(function () {
                    NProgress.done();
                });
        };

        $scope.setWatched = function (ep) {
            NProgress.start();

            var promise;
            if (!ep.user.seen) {
                promise = episodes.postWatched({}, {id: ep.id});
            }
            else {
                promise = episodes.removeWatched({}, {id: ep.id});
            }

            return promise
                .then(function () {
                    ep.user.seen = !ep.user.seen;
                })
                .finally(function () {
                    NProgress.done();
                });
        };


    });
