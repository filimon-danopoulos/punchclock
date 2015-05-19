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
                        templateUrl: 'app/history/templates/history.html',
                        controller: 'HistoryController as vm'
                    }
                }
            })
            .state('app.details', {
                url: '/details/:date',
                views: {
                    'tab-history': {
                        templateUrl: 'app/history/templates/details.html',
                        controller: 'DetailsController as vm'
                    }
                }
            });
    }
})();
