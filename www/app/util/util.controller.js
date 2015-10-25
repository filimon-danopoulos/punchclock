(function() {
    'use strict';

    angular.module('app.util')
        .controller('UtilController', UtilController);

    UtilController.$inject = [
        '$scope',
        '$ionicModal',
        'timeCalculationService',
        'persistenceService',
        'dayEntity'
    ];
    function UtilController($scope, $ionicModal, time, persistence, day) {
        var vm = this,
            departureTimeModal,
            openModal,
            savedDataModal;

        vm.departureTimeData = {
            time: '',
            timeLeft: ''
        };
        vm.savedData = '';

        /// Actions
        vm.closeModal = closeModal;
        vm.showDepartureTimeModal = showDepartureTimeModal;
        vm.hasDepartureTimeData = hasDepartureTimeData;
        vm.hasTimeLeft = hasTimeLeft;
        vm.hasOvertime = hasOvertime;
        vm.showSavedDataModal = showSavedDataModal;

        /// Events
        $scope.$on('$ionicView.enter', initialize);
        $scope.$on('$destroy', cleanUp);

        /// Implementation
        function initialize() {
            loadModals();
        }

        function cleanUp() {
            departureTimeModal.remove();
        }

        function loadModals() {
            $ionicModal.fromTemplateUrl('app/util/templates/departure-time-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                departureTimeModal = modal;
            });

            $ionicModal.fromTemplateUrl('app/util/templates/saved-data-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                savedDataModal = modal;
            });
        }

        function closeModal() {
            openModal.hide();
        }

        function showDepartureTimeModal() {
            loadDepartureTime();
            openModal = departureTimeModal;
            departureTimeModal.show();
        }

        function loadDepartureTime() {
            var data = persistence.entity(day).select(time.getCurrentKey());
            vm.departureTimeData.time = time.getDepartureTime(
                data.arrival.value,
                data.lunchStart.value,
                data.lunchStop.value
            );
            vm.departureTimeData.timeLeft = time.getTimeLeft(
                data.arrival.value,
                data.lunchStart.value,
                data.lunchStop.value
            );
        }

        function hasDepartureTimeData() {
            return vm.departureTimeData.time !== 'NaN:NaN' &&
                vm.departureTimeData.timeLeft !== 'NaN:NaN';
        }

        function hasTimeLeft() {
            return hasDepartureTimeData() &&
                vm.departureTimeData.timeLeft[0] !== '-';
        }

        function hasOvertime() {
            return hasDepartureTimeData() &&
                vm.departureTimeData.timeLeft[0] === '-';
        }

        function showSavedDataModal() {
            loadSavedData();
            openModal = savedDataModal;
            openModal.show();
        }

        function loadSavedData() {
            var data = persistence.entity(day).selectAll();
            vm.savedData = JSON.stringify(data, null, "  ");
        }
    }
})();
