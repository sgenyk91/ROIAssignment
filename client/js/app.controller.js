(function() {
  angular
    .module('app')
    .controller('mainController', mainController);

  mainController.$inject = ['$http'];

  function mainController($http) {
    var vm = this;
    vm.getFacebook = getFacebook;

    function getFacebook() {
      $http.get('/facebook');
    }
  }
})();