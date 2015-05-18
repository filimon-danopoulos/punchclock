(function() {
    'use strict';

    angular.module('app.history')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('app.history', {
                url: '/history',
                views: {
                    'tab-history': {
                        templateUrl: 'app/history/history.html',
                        controller: 'HistoryController as vm'
                    }
                }
            });
    }
})();
