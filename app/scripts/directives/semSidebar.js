'use strict';

angular.module('BSMashup.Webapp')
    .directive('semSidebar', function () {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {



                if (window.innerWidth < 768) {
                    element.sidebar({overlay: true});
                }
                else {
                    element.sidebar('show');
                }

//                element.sidebar('attach events', '.toggle.button')
            }
        };
    });
