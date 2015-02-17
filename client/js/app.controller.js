(function() {
  angular
    .module('app')
    .controller('mainController', mainController);

  mainController.$inject = ['$http', '$window'];

  function mainController($http, $window) {
    var vm = this;
    vm.getThirdPartyAuth = getThirdPartyAuth;

    function getThirdPartyAuth(name) {
      $window.location = $window.location.protocol + "//" + $window.location.host + $window.location.pathname + name;
    }

  }
})();