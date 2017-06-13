'use strict';

describe('Controller: ConnectFourCtrl', function () {

  // load the controller's module
  beforeEach(module('connectFourApp'));

  var ConnectFourCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConnectFourCtrl = $controller('ConnectFourCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(ConnectFourCtrl.awesomeThings.length).toBe(3);
  });
});
