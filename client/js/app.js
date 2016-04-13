var app = angular.module('aymontcaApp', ['lbServices', 'restangular','ui.router']);

app.config(function(RestangularProvider, $stateProvider, $urlRouterProvider) {
    RestangularProvider.setBaseUrl('http://localhost:3000/api')
});