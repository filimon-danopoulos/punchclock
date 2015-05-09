(function() {
    'use strict';

    angular.module('app.tabs')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "app/tabs/tabs.html"
            });
    }
})();
