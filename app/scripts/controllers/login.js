'use strict';

angular.module('BSMashup.Webapp')
    .controller('LoginCtrl', function ($scope, $state, $window, BetaSeries) {


        $scope.loggedIn = BetaSeries.loggedIn;

        $scope.login = function () {
            BetaSeries.login().then(function () {
                $scope.loggedIn = BetaSeries.loggedIn;
                $state.go('landing');
            });
        };

        $scope.logout = function () {
            BetaSeries.logout();
            $scope.loggedIn = BetaSeries.loggedIn;
        };

    }
);
