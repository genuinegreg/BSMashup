'use strict';

angular.module('BSMashup.Webapp')
    .directive('episode', function () {
        return {
            templateUrl: 'views/directives/episode.html',
            restrict: 'E',
            replace: true,
            scope: {
                show: '=',
                data: '='
            },
            controller: function ($scope, $window, Fenopy) {

                $scope.openMagnet = function () {
                    NProgress.start();
                    Fenopy.search($scope.show.title + ' 720p ' + $scope.data.code, 10)
                        .then(function (data) {
                            console.log(data[1]);
//                            $window.location = data[1].magnet;

                        })
                        .finally(function () {
                            NProgress.done();
                        });
                };

            }
        };
    });
