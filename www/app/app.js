(function() {
    'use strict';

    var dependecies = [
        // Third party modules
        'ionic',
        // Application modules
        'app.common',
        'app.tabs',
        'app.punchclock',
        'app.history',
        'app.util'
    ];

    angular.module('app', dependecies)
        .run(run)
        .config(config);

    run.$inject = ['$ionicPlatform'];
    function run($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    }

    config.$inject = ['$urlRouterProvider'];
    function config($urlRouterProvider) {
        // Default route
        $urlRouterProvider.otherwise('/app/punchclock');
    }

})();
