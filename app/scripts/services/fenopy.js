'use strict';

angular.module('BSMashup.Webapp')
    .factory('FenopyRestangular', function (Restangular) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl('http://www.corsproxy.com/fenopy.se/module/search');
            RestangularConfigurer.setDefaultRequestParams('get', {limit: '5', format: 'json'});
        }).all('api.php');
    })
    .service('Fenopy', function Fenopy(FenopyRestangular) {

        return {
            search: function (keyword, limit) {
                return FenopyRestangular.getList({
                    keyword: keyword,
                    limit: limit
                });
            }
        };
    });
