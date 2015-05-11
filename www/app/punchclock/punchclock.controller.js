(function() {
    'use strict';

    angular.module('app.punchclock')
        .controller('PunchClockController', PunchClockController);

    PunchClockController.$inject = [
        '$scope',
        '$timeout',
        '$ionicPopup',
        'punchclockDefaults',
        'timeCalculationService'
    ];
    function PunchClockController(
            $scope,
            $timeout,
            $ionicPopup,
            punchclockDefaults,
            time) {
        var vm = this,
            editModal;

        /// Data
        vm.today = punchclockDefaults;

        /// Actions
        vm.editEntry = editEntry;
        vm.setTime = setTime;
        vm.getKeys = getKeys;
        vm.canShowTotalHours = canShowTotalHours;
        vm.getTotalHours = getTotalHours;
        vm.canShowCheckMarkButton = canShowCheckMarkButton;
        vm.undo = undo;

        /// Initialize
        initialize();
        /// Implementation
        function initialize() {

        }

        function editEntry(target) {
            if (!vm.today[target].value) {
                return;
            }
            vm.edited = target;
            showEditPopup();
        }

        function showEditPopup() {
            $ionicPopup.prompt({
                title: 'Enter new time',
                subTitle: 'The entry will be marked as edited.',
                cssClass: 'edit-time-popup',
                inputPlaceholder: vm.today[vm.edited].value
            }).then(function(newTime) {
                if (newTime) {
                    doEdit(newTime);
                }
            });
        }

        function doEdit(newTime) {
            var now = new Date(),
                timeParts = newTime.split(':');
            now.setHours(timeParts[0]);
            now.setMinutes(timeParts[1]);
            vm.today[vm.edited].original = vm.today[vm.edited].value;
            vm.today[vm.edited].value = time.getTimeString(now);
            vm.today[vm.edited].timestamp = +now;
            vm.today[vm.edited].canUndo = false;
            vm.today[vm.edited].edited = true;

            vm.edited = null;
        }

        function setTime(target, isEdit) {
            var now = new Date();
            vm.today[target].value = time.getTimeString(now);
            vm.today[target].timestamp = +now;
            vm.today[target].canUndo = true;
            $timeout(function() {
                vm.today[target].canUndo = false;
            }, 10000);
        }


        function getKeys() {
            return Object.keys(vm.today)
                .sort(function(a, b) {
                    return vm.today[a].order - vm.today[b].order;
                });
        }

        function canShowTotalHours() {
            return Object.keys(vm.today)
                .every(function(x) {
                    return vm.today[x].value;
                });
        }

        function getTotalHours() {
            return time.getTotalHours(
                vm.today.arrival.value,
                vm.today.lunchStart.value,
                vm.today.lunchStop.value,
                vm.today.departure.value
            );
        }


        function canShowCheckMarkButton(target) {
            return !vm.today[target].value;
        }

        function undo(target) {
            vm.today[target].value = null;
            vm.today[target].timestamp = null;
            vm.today[target].canUndo = false;
        }
    }
})();
