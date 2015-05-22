(function() {
    'use strict';

    angular.module('app.punchclock')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('app.punchclock', {
                url: '/punchclock',
                views: {
                    'tab-punchclock': {
                        templateUrl: 'app/punchclock/punchclock.html',
                        controller: 'PunchClockController as vm'
                    }
                }
            });
    }
})();
