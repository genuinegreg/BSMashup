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
            .otherwise({
                redirectTo: '/'
            });
    });


angular.module('BSMashup.Webapp')
    .controller('RoutesCtrl', function ($scope, $location, Betaseries) {

        console.log('mainCtrl loaded');
        $scope.$on('$routeChangeStart', function () {
            console.log('$routeChangeStart');
            NProgress.start();
        });
        $scope.$on('$routeChangeSuccess', function () {
            console.log('$routeChangeSuccess');
            NProgress.done(true);
        });
        $scope.$on('$routeChangeError', function (event, current, previous, rejection) {
            console.log('$routeChangeError', event, current, previous, rejection);
            NProgress.done(true);

            if (
                rejection.status === 400 &&
                rejection.data &&
                rejection.data.errors &&
                rejection.data.errors[0].code === 2001) {

                Betaseries.logout();
                $location.path('/auth');
            }
        });
    });
