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

        /// Events
        $scope.$on('$destroy', function() {
            departureTimeModal.remove();
        });

        /// Initialization
        initialize();
        /// Implementation
        function initialize() {
            $ionicModal.fromTemplateUrl('app/util/templates/departure-time-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                departureTimeModal = modal;
            });

        }

        function closeModal() {
            openModal.hide();
        }

        function showDepartureTimeModal() {
            var data = persistence.entity(day).select(time.getCurrentKey());
            openModal = departureTimeModal;
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
            departureTimeModal.show();
        }
    }
})();
