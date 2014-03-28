'use strict';

describe('Directive: semSidebar', function () {

  // load the directive's module
  beforeEach(module('bsmashupwebappApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sem-sidebar></sem-sidebar>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the semSidebar directive');
  }));
});
