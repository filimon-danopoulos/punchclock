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
            openModal;

        vm.departureTimeData = {
            time: '',
            timeLeft: ''
        };

        /// Actions
        vm.closeModal = closeModal;
        vm.showDepartureTimeModal = showDepartureTimeModal;
        vm.hasDepartureTimeData = hasDepartureTimeData;
        vm.hasTimeLeft = hasTimeLeft;
        vm.hasOvertime = hasOvertime;

        /// Events
        $scope.$on('$ionicView.enter', initialize);
        $scope.$on('$destroy', cleanUp);

        /// Implementation
        function initialize() {
            loadModal();
        }

        function cleanUp() {
            departureTimeModal.remove();
        }

        function loadModal() {
            $ionicModal.fromTemplateUrl('app/util/templates/departure-time-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                departureTimeModal = modal;
            });

            loadModalData();
        }

        function loadModalData() {
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

        function closeModal() {
            openModal.hide();
        }

        function showDepartureTimeModal() {
            openModal = departureTimeModal;
            departureTimeModal.show();
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
    }
})();
