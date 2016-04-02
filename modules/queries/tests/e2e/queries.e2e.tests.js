'use strict';

describe('Queries E2E Tests:', function () {
  describe('Test queries page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/queries');
      expect(element.all(by.repeater('querie in queries')).count()).toEqual(0);
    });
  });
});
