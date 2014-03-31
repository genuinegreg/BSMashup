'use strict';

angular.module('BSMashup.Webapp')
    .directive('episode', function () {
        return {
            templateUrl: 'views/directives/episode.html',
            restrict: 'E',
            replace: true,
            scope: {
                show: '=',
                ep: '=data'
            },
            controller: function ($scope, $window, $q, Fenopy, BetaSeries) {

                var episodes = BetaSeries.rest.all('episodes');
                var subtitles = BetaSeries.rest.all('subtitles');

                $scope.openMagnet = function (ep, show) {
                    // start progress indicator
                    NProgress.start();

                    // retrive magnet
                    var magnetPromise = Fenopy.search(show.title + ' 720p ' + ep.code, 10)
                        .then(function (data) {
                            $window.location = data[1].magnet;

                        });

                    // setDownloaded
                    var setDownloadedPromise = episodes.postDownloaded({}, {id: ep.id})
                        .then(function () {
                            ep.user.downloaded = true;
                        }).finally(function () {
                            console.log('yo');
                        });

                    $q.all(magnetPromise, setDownloadedPromise)
                        .then(NProgress.done);

                };


                $scope.openSubtitle = function (ep) {
                    NProgress.start();

                    subtitles.getList({id: ep.id, language: 'vf'})
                        .then(function (data) {
                            data.subtitles.sort(function (a, b) {
                                if (a.quality > b.quality) {
                                    return -1;
                                }
                                else if (a.quality < b.quality) {
                                    return 1;
                                }
                                else {
                                    return 0;
                                }
                            });
                            window.location = data.subtitles[0].url;
                        })
                        .finally(NProgress.done);
                };

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

            }
        };
    });
