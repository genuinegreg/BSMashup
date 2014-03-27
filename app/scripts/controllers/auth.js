'use strict';

angular.module('BSMashup.Webapp')
    .controller('AuthCtrl', function ($location, BetaSeries) {

        if (BetaSeries.isLogedin()) {
            $location.path('/');
            return;
        }

        BetaSeries.auth().then(function() {
            if (BetaSeries.isLogedin()) {
                $location.path('/');
                return;
            }
        });
    });
