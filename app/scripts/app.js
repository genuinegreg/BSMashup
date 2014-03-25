'use strict';

angular.module('BSMashup.Webapp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'restangular'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: {
                    episodesList: ['Betaseries', function (Betaseries) {
                        return Betaseries.episodeList();
                    }]
                }
            })
            .when('/auth', {
                templateUrl: 'views/auth.html',
                controller: 'AuthCtrl'
            })
            .when('/tvshow', {
                templateUrl: 'views/tvshow.html',
                controller: 'TvshowCtrl'
            })
            .when('/template', {
                templateUrl: 'views/template.html',
                controller: 'MainCtrl',
                resolve: {
                    episodesList: ['Betaseries', function (Betaseries) {
                        return Betaseries.episodeList();
                    }]
                }
            })
            .otherwise({
                redirectTo: '/'
            });
    });


angular.module('BSMashup.Webapp')
    .controller('RoutesCtrl', function ($scope) {

        console.log('mainCtrl loaded');
        $scope.$on('$routeChangeStart', function () {
            console.log('$routeChangeStart');
            NProgress.start();
        });
        $scope.$on('$routeChangeSuccess', function () {
            console.log('$routeChangeSuccess');
            NProgress.done(true);
        });
        $scope.$on('$routeChangeError', function () {
            console.log('$routeChangeError');
            NProgress.done(true);
        });
    });
