(function() {
    'use strict';

    angular.module('app.history')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = ['$scope', 'settingsService'];
    function SettingsController($scope, settingsService) {
        var vm = this;

        /// Actions
        vm.saveShowResultAsDecimal = saveShowResultAsDecimal;
        vm.saveShowHistoryTotalsAsDecimals = saveShowHistoryTotalsAsDecimals;
        vm.saveShowIncompleEntiesInHistory = saveShowIncompleEntiesInHistory;

        /// Events
        $scope.$on('$ionicView.enter', initialize);

        /// Implementation
        function initialize() {
            vm.settings = settingsService.loadSettings() || {};
        }

        function saveShowResultAsDecimal() {
            settingsService.saveSetting(
                'showResultAsDecimal',
                vm.settings.showResultAsDecimal
            );
        }

        function saveShowHistoryTotalsAsDecimals() {
            settingsService.saveSetting(
                'showHistoryTotalsAsDecimals',
                vm.settings.showHistoryTotalsAsDecimals
            );
        }

        function saveShowIncompleEntiesInHistory() {
            settingsService.saveSetting(
                'showIncompleEntiesInHistory',
                vm.settings.showIncompleEntiesInHistory
            );
        }
    }
})();
