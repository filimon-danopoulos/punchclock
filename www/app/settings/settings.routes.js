(function() {
    'use strict';

    angular.module('app.settings')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('app.settings', {
                url: '/settings',
                views: {
                    'tab-settings': {
                        templateUrl: 'app/settings/settings.html',
                        controller: 'SettingsController as vm'
                    }
                }
            });
    }
})();
