'use strict';

angular.module('BSMashup.Webapp')
    .service('Betaseries', function Betaseries(Restangular, $window, $location, $q, $route) {

        // const
        var apiKey = '4614F428BAD8';

        var defaultRequestParam = {v: '2.2', key: apiKey};
        defaultRequestParam.token = localStorage.userToken;

        // Restangular config
        Restangular.setBaseUrl('http://127.0.0.1:9293/betaseries');
        Restangular.setDefaultRequestParams('get', defaultRequestParam);
        Restangular.setDefaultRequestParams('post', defaultRequestParam);


        function auth() {

            var d = $q.defer();

            // if not loged in && no usertoken in location.search => redirect to betaseries to login
            if (!isLogedin() && !$location.search().token) {

                console.log('!logedin + !token');

                Restangular.all('members').one('oauth').post().then(
                    function resolve(res) {
                        console.log('response :', res);
                        if (!res.oauth.key) {
                            d.reject();
                            return;
                        }
                        d.resolve();
                        $window.location = 'https://www.betaseries.com/oauth?key=' + res.oauth.key;

                    },
                    function reject() {
                        d.reject();
                    });

                return d.promise;
            }

            // if not loged in and we get a token inlocation.search
            if (!isLogedin() && $location.search().token) {
                console.log('!logedin + token');

                localStorage.logedin = true;
                localStorage.userToken = $location.search().token;

                defaultRequestParam.token = localStorage.userToken;

                // wipe token from url
                $location.search('token', undefined);
                d.resolve();
                return d.promise;
            }

            if (isLogedin()) {
                d.resolve();
            }

            return d.promise;
        }

        function isLogedin() {
            return localStorage.logedin && localStorage.userToken;
        }

        function logout() {
            localStorage.removeItem('logedin');
            localStorage.removeItem('userToken');
            defaultRequestParam.token = undefined;

            $route.reload();
        }


        return {
            isLogedin: isLogedin,
            auth: auth,
            logout: logout,
            episodeList: function episodeList(limit, showId) {
                limit = limit || undefined;
                showId = showId || undefined;

                var params = {
                    limit: limit,
                    showId: showId
                };

                return Restangular.all('episodes').get('list', params);
            }
        };


    });
