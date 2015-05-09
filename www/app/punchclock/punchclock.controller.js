(function() {
    'use strict';

    angular.module('app.punchclock')
        .controller('PunchClockController', PunchClockController);

    PunchClockController.inject = ['$scope'];
    function PunchClockController($scope) {
        var vm = this;

        vm.alert = function() {
            alert(1);
        };
    }
})();
