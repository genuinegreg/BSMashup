'use strict';

// BetaSeries configuration
angular.module('BSMashup.BetaSeries').config(function ($provide) {

    $provide.value(
        'BETA_SERIES_CALLBACK_URL',
            window.location.origin + window.location.pathname + 'oauth.html'
    );

    $provide.value(
        'BETA_SERIES_BASE_URL',
        'https://plop.io/bsmashup/betaseries');

    $provide.value(
        'BETA_SERIES_KEY',
        '4614F428BAD8');

    $provide.value(
        'BETA_SERIES_SECRET_KEY',
        '6805b9afc390b0fc1cc20c8c7eabff0e');

    $provide.value(
        'BETA_SERIES_VERSION',
        '2.2');

});