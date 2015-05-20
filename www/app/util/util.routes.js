(function() {
    'use strict';

    angular.module('app.util')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('app.util', {
                url: '/util',
                views: {
                    'tab-util': {
                        templateUrl: 'app/util/templates/util.html',
                        controller: 'UtilController as vm'
                    }
                }
            });
    }
})();
