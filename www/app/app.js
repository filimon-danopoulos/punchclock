(function() {
    'use strict';

    var dependecies = [
        // Third party modules
        'ionic',
        'ngMessages',
        'ngCordova',
        // Application modules
        'app.common',
        'app.settings',
        'app.tabs',
        'app.punchclock',
        'app.history',
        'app.util'
    ];

    angular.module('app', dependecies)
        .config(config)
        .run(run);

    config.$inject = ['$urlRouterProvider', '$ionicConfigProvider'];
    function config($urlRouterProvider, $ionicConfigProvider) {
        // Default route
        $urlRouterProvider.otherwise('/app/punchclock');

        // Tabs on bottom for all platforms
        $ionicConfigProvider.tabs.position('bottom');
    }


    run.$inject = ['$ionicPlatform', '$cordovaSplashscreen'];
    function run($ionicPlatform, $cordovaSplashscreen) {
        $ionicPlatform.ready(function() {
            $cordovaSplashscreen.hide();
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


})();
