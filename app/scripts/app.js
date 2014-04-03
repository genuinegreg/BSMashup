'use strict';

angular.module('BSMashup.Webapp',
    [
        'ngCookies',
        'ngTouch',
        'ngResource',
        'ngSanitize',
        'ui.router',
        'restangular',
        'angularOauth',
        'BSMashup.BetaSeries'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/series/episodes');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .state('landing', {
                url: '/landing',
                templateUrl: 'views/landing.html'
            })
            .state('series', {
                url: '/series',
                templateUrl: 'views/root.html'
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
            });
    });


angular.module('BSMashup.Webapp')
    .controller('StateChangeCtrl', function ($scope, $state, $location, BetaSeries) {

        $scope.swipeLeft = function () {
            console.log('swipeLeft');
            $scope.openSidebar = false;
            $('.ui.sidebar').sidebar('hide');
        };

        $scope.swipeRight = function () {
            console.log('swipeRight');
            $scope.openSidebar = true;
            $('.ui.sidebar').sidebar('show');
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

                console.log('login in');

                BetaSeries.logout();
                $state.go('login');
            }
        });
    });
