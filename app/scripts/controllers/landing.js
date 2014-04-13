'use strict';

angular.module('BSMashup.Webapp')
    .controller('LandingCtrl', function ($scope, $state, $window, BetaSeries) {

        if (BetaSeries.loggedIn) {
            return $state.go('series.episodes');
        }


        $scope.login = function () {
            BetaSeries.login().then(function () {
                $state.go('series.episodes');
            });
        };

    }
);
