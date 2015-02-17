(function() {
  angular
  .module('app', ['ui.router'])
  .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function config($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);
    
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '../views/home.html'
      })
      .state('login', {
        url: '/login',
        templateUrl: '../views/login.html'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: '../views/signup.html'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: '../views/profile.html'
      })
      .state('confirmation', {
        url: '/confirmation',
        template: 'Please check your email to confirm your registration!'
      })
      .state('forgot', {
        url: '/forgot',
        templateUrl: '../views/forgot.html'
      });

  }
})();