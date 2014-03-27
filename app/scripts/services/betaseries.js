'use strict';

angular.module('BSMashup.BetaSeries', ['restangular', 'LocalStorageModule'])
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('BSMashup.BetaSeries');
    })
    .service('BetaSeries', function BetaSeriesFactory(Restangular, localStorageService, BETA_SERIES_BASE_URL, BETA_SERIES_KEY, BETA_SERIES_VERSION, $window, $location, $q, $route) {

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
            RestangularConfigurer.setDefaultHeaders(
                {
                    'X-BetaSeries-Version': BETA_SERIES_VERSION,
                    'X-BetaSeries-Key': BETA_SERIES_KEY,
                    'X-BetaSeries-Token': token()
                }
            );
        });


        function auth() {
            // if logged-in just pass
            if (token()) {
                return $q.defer().resolve();
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
            $route.reload();
            return $q.defer().resolve('loggedIn');
        }

        function logout() {
            localStorageService.clearAll();
            $route.reload();
        }


        return {
            isLoggedIn: function() {
                return !!token();
            },
            auth: auth,
            logout: logout,
            episodeList: function episodeList(limit, showId) {
                limit = limit || undefined;
                showId = showId || undefined;

                var params = {
                    limit: limit,
                    showId: showId
                };

                return rest.all('episodes').get('list', params);
            }
        };


    });
