'use strict';

angular.module('BSMashup.BetaSeries', ['restangular', 'LocalStorageModule'])
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('BSMashup.BetaSeries');
    })
    .service('BetaSeries', function BetaSeriesFactory(Restangular, localStorageService, BETA_SERIES_BASE_URL, BETA_SERIES_KEY, BETA_SERIES_VERSION, $window, $location, $q, $state) {

        /**
         * get or set betaseries user token
         * @param [t] token
         * @returns {String|undefined} token
         */
        function token(t) {
            if (!t) {
                return localStorageService.get('token');
            }
            localStorageService.add('token', t);
        }


        // betaseries restangular config
        var rest = Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(BETA_SERIES_BASE_URL);
        });

        rest.addElementTransformer('episodes', true, function(episodes) {

            episodes.addRestangularMethod('getList', 'get', 'list');
            episodes.addRestangularMethod('postDownloaded', 'post', 'downloaded');
            episodes.addRestangularMethod('removeDownloaded', 'remove', 'downloaded');
            episodes.addRestangularMethod('postWatched', 'post', 'watched');
            episodes.addRestangularMethod('removeWatched', 'remove', 'watched');

            return episodes;
        });

        rest.addElementTransformer('subtitles', true, function(episodes) {

            episodes.addRestangularMethod('getList', 'get', 'episode');

            return episodes;
        });

        function setDefaultHeader() {
            rest.setDefaultHeaders(
                {
                    'X-BetaSeries-Version': BETA_SERIES_VERSION,
                    'X-BetaSeries-Key': BETA_SERIES_KEY,
                    'X-BetaSeries-Token': token()
                }
            );
        }
        setDefaultHeader();


        function login() {
            var d = $q.defer();

            // if logged-in just pass
            if (token()) {
                d.resolve();
                return d.promise;
            }

            // if url is clean (no token) get and oauth key and redirect  to betaseries for login
            if (!$location.search().token) {
                return rest.all('members').one('oauth').post().then(
                    function resolved(res) {
                        if (!res.oauth.key) {
                            return $q.reject('can\'t get an oauth key');
                        }
                        $window.location = 'https://www.betaseries.com/oauth?key=' + res.oauth.key;
                    }
                );
            }

            // save auth token
            token($location.search().token);
            setDefaultHeader();

            d.resolve('loggedIn');
            return d.promise;
        }

        function logout() {
            localStorageService.clearAll();
        }


        return {
            isLoggedIn: function() {
                return !!token();
            },
            login: login,
            logout: logout,
            episodesList: function episodesList(limit, showId) {
                limit = limit || undefined;
                showId = showId || undefined;

                var params = {
                    limit: limit,
                    showId: showId
                };

                return rest.all('episodes').getList(params);
            },
            rest: rest

        };


    });
