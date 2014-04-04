'use strict';

angular.module('BSMashup.Webapp',
    [
        'ui.router',
        'restangular',
        'BSMashup.BetaSeries'
    ])
    .config(function($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|magnet):/);
    })
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/series/episodes');

        $stateProvider
            .state('landing', {
                url: '/landing',
                templateUrl: 'views/landing.html',
                controller: 'LandingCtrl'
            })
            .state('series', {
                abstract: true,
                url: '/series',
                templateUrl: '../views/series.html'
            })
            .state('series.episodes', {
                url: '/episodes',
                templateUrl: 'views/series.episodes.html',
                controller: 'EpisodesCtrl',
                resolve: {
                    episodesList: ['BetaSeries', function (BetaSeries) {
                        return BetaSeries.rest.all('episodes').getList();
                    }]
                }
            })
            .state('series.details', {
                url: '/:showId',
                templateUrl: 'views/series.details.html',
                controller: 'ShowDetailsCtrl',
                resolve: {
                    showDetails: ['BetaSeries', '$stateParams', function (BetaSeries, $stateParams) {
                        return BetaSeries.rest.all('shows').getDetails({
                            id: $stateParams.showId
                        });
                    }],
                    episodesList: ['BetaSeries', '$stateParams', function (BetaSeries, $stateParams) {
                        return BetaSeries.rest.all('episodes').getList($stateParams);
                    }]
                }
            })
//            .state('series.episode', {
//                abstract: true,
//                template: '<div ui-view></div>'
//            })
            .state('series.episode', {
                url: '/:showId/episode/:id',
                templateUrl: 'views/series.episodes.details.html',
                controller: 'EpisodeDetailsCtrl',
                resolve: {
                    episodeDetails: ['BetaSeries', '$stateParams', function (BetaSeries, $stateParams) {
                        return BetaSeries.rest.all('episodes').getDetails({id: $stateParams.id, subtitles: true});
                    }],
                    torrentsList: ['Fenopy', 'BetaSeries', '$stateParams', function (Fenopy, BetaSeries, $stateParams) {
                        return BetaSeries.rest.all('episodes').getDetails({id: $stateParams.id, subtitles: true})
                            .then(function (episodeDetails) {
                                return episodeDetails.episode;
                            })
                            .then(function(episode) {
                                /* jshint ignore:start */
                                return Fenopy.search(episode.show_title + ' 720p ' + episode.code, 10);
                                /* jshint ignore:end */
                                return;
                            });
                    }]
                }

            });
    });


angular.module('BSMashup.Webapp')
    .controller('StateChangeCtrl', function ($scope, $state, $location, BetaSeries) {

        $scope.logout = function () {
            BetaSeries.logout();
            $state.go('landing');
        };


        console.log('mainCtrl loaded');
        $scope.$on('$stateChangeStart', function () {
            console.log('$stateChangeStart');
            NProgress.start();
        });
        $scope.$on('$stateChangeSuccess', function () {
            console.log('$stateChangeSuccess');
            NProgress.done(true);
        });
        $scope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            console.log('$stateChangeError', event, toState, toParams, fromState, fromParams, error);
            NProgress.done(true);

            $scope.toState = toState;
            $scope.toParam = toParams;

            if (
                error.status === 400 &&
                error.data &&
                error.data.errors &&
                error.data.errors[0].code === 2001) {


                BetaSeries.logout();
                $state.go('landing');
            }
        });
    });
