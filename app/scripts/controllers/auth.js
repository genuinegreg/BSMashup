'use strict';

angular.module('BSMashup.Webapp')
    .controller('AuthCtrl', function ($location, Betaseries) {

        if (Betaseries.isLogedin()) {
            $location.path('/');
            return;
        }

        Betaseries.auth().then(function() {
            if (Betaseries.isLogedin()) {
                $location.path('/');
                return;
            }
        });
    });
