'use strict';

describe('Controller: TvshowCtrl', function () {

  // load the controller's module
  beforeEach(module('bsmashupwebappApp'));

  var TvshowCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TvshowCtrl = $controller('TvshowCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
