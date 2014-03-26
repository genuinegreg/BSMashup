'use strict';

describe('Service: Fenopy', function () {

    // load the service's module
    beforeEach(module('bsmashupwebappApp'));

    // instantiate service
    var Fenopy;
    beforeEach(inject(function (_Fenopy_) {
        Fenopy = _Fenopy_;
    }));

    it('should do something', function () {
        expect(!!Fenopy).toBe(true);
    });

});
