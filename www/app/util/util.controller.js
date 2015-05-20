(function() {
    'use strict';

    angular.module('app.util')
        .controller('UtilController', UtilController);

    UtilController.$inject = ['$scope', '$ionicModal', 'timeCalculationService'];
    function UtilController($scope, $ionicModal, time) {
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
            openModal = departureTimeModal;
            departureTimeModal.show();
        }
    }
})();
