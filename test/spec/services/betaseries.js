'use strict';

describe('Service: Betaseries', function () {

    // load the service's module
    beforeEach(module('bsmashupwebappApp'));

    // instantiate service
    var Betaseries;
    beforeEach(inject(function (_Betaseries_) {
        Betaseries = _Betaseries_;
    }));

    it('should do something', function () {
        expect(!!Betaseries).toBe(true);
    });

});
