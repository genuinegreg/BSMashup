'use strict';

angular.module('BSMashup.BetaSeries', ['restangular', 'LocalStorageModule'])
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('BSMashup.BetaSeries');
    })
    .service('BetaSeries', function BetaSeriesFactory(Restangular, localStorageService, BETA_SERIES_BASE_URL, BETA_SERIES_KEY, BETA_SERIES_SECRET_KEY, BETA_SERIES_VERSION, $rootScope, $window, $location, $q) {

        var _this = this;

        //**************************************
        // Methods definition

        /**
         * get or set betaSeries user token
         * @param [t] token
         * @returns {String|undefined} token
         */
        _this.token = function (t) {
            if (!t) {
                return localStorageService.get('token');
            }
            _this.loggedIn = !!t;
            localStorageService.add('token', t);

        };

        /**
         * Initialize login flow
         * @returns {*}
         */
        _this.login = function () {

            console.log('loggin in');

            var d = $q.defer();

            // if logged-in just pass
            if (_this.token()) {
                d.resolve();
                return d.promise;
            }


            var popupOptions = {
                name: 'BetaSeries login',
                openParams: {
                    width: 650,
                    height: 300,
                    resizable: true,
                    scrollbars: true,
                    status: true
                }
            };

            var params = {
                /* jshint ignore:start */
                client_id: BETA_SERIES_KEY,
                redirect_uri: $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/oauth.html'
                /* jshint ignore:end */
            };

            console.log(params);


            var formatPopupOptions = function (options) {
                var pairs = [];
                angular.forEach(options, function (value, key) {
                    if (value || value === 0) {
                        value = value === true ? 'yes' : value;
                        pairs.push(key + '=' + value);
                    }
                });
                return pairs.join(',');
            };

            var popupDefered = $q.defer();

            $window.open(
                    'https://www.betaseries.com/authorize?client_id=' + BETA_SERIES_KEY + '&redirect_uri=' + $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/oauth.html',
                popupOptions.name,
                formatPopupOptions(popupOptions.openParams));

            window.addEventListener('message', function (event) {
                if (
                    event.origin === $location.protocol() + '://' + $location.host() + ':' + $location.port() &&
                    event.data.code) {

                    popupDefered.resolve(event.data.code);
                }
            });


            popupDefered.promise.then(function (code) {

                console.log('post call');

                /*jshint camelcase: false */
                rest.all('members').customPOST(
                    {},
                    'access_token', {
                        client_id: BETA_SERIES_KEY,
                        client_secret: BETA_SERIES_SECRET_KEY,
                        redirect_uri: params.redirect_uri,
                        code: code
                    })
                    .then(function (data) {
                        _this.token(data.token);
                        setDefaultHeader();
                        d.resolve();
                    });
                /* jshint camelcase: true */
            });

            return d.promise;
        };

        /**
         * Log out from betaseries
         */
        _this.logout = function () {
            localStorageService.clearAll();
            setDefaultHeader();
            _this.loggedIn = false;
        };


        //*****************************************
        // config


        // betaseries restangular config
        var rest = Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(BETA_SERIES_BASE_URL);
        });
        _this.rest = rest;

        // define restAngular 'episodes' element transformer
        rest.addElementTransformer('episodes', true, function (episodes) {

            episodes.addRestangularMethod('getList', 'get', 'list');
            episodes.addRestangularMethod('getDetails', 'get', 'display');
            episodes.addRestangularMethod('postDownloaded', 'post', 'downloaded');
            episodes.addRestangularMethod('removeDownloaded', 'remove', 'downloaded');
            episodes.addRestangularMethod('postWatched', 'post', 'watched');
            episodes.addRestangularMethod('removeWatched', 'remove', 'watched');

            return episodes;
        });

        // define restAngular 'subtitles' element transformer
        rest.addElementTransformer('subtitles', true, function (episodes) {

            episodes.addRestangularMethod('getList', 'get', 'episode');

            return episodes;
        });

        // define restAngular 'shows' element transformer
        rest.addElementTransformer('shows', true, function (episodes) {

            episodes.addRestangularMethod('getDetails', 'get', 'display');

            return episodes;
        });


        // default header function
        function setDefaultHeader() {
            rest.setDefaultHeaders(
                {
                    'X-BetaSeries-Version': BETA_SERIES_VERSION,
                    'X-BetaSeries-Key': BETA_SERIES_KEY,
                    'X-BetaSeries-Token': _this.token ? _this.token() : undefined
                }
            );
        }

        // set default header
        setDefaultHeader();

        _this.loggedIn = !!_this.token();


    });
