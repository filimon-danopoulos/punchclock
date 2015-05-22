(function() {
    'use strict';

    angular.module('app.punchclock')
        .controller('PunchClockController', PunchClockController);

    PunchClockController.$inject = [
        '$scope',
        '$timeout',
        '$ionicPopup',
        '$ionicListDelegate',
        'timeCalculationService',
        'persistenceService',
        'dayEntity',
        'dayEntityKey',
        'dayMappingService',
        'punchclockDefaults',
        'settingsService'
    ];
    function PunchClockController(
            $scope,
            $timeout,
            $ionicPopup,
            $ionicListDelegate,
            time,
            persistence,
            dayEntity,
            dayEntityKey,
            dayMapper,
            defaultValues,
            settings) {
        var vm = this,
            editModal;

        /// Data
        vm.activities = [
            'arrival',
            'lunchStart',
            'lunchStop',
            'departure'
        ];
        vm.today = {};

        /// Actions
        vm.editEntry = editEntry;
        vm.clearEntry = clearEntry;
        vm.setTime = setTime;
        vm.canShowTotalHours = canShowTotalHours;
        vm.getTotalHours = getTotalHours;
        vm.canShowCheckMarkButton = canShowCheckMarkButton;
        vm.hasVisibleButton = hasVisibleButton;
        vm.undo = undo;
        vm.toggleShowResultAsDecimal = toggleShowResultAsDecimal;
        vm.getTotalDescription = getTotalDescription;

        /// Events
        $scope.$on('$ionicView.beforeEnter', initialize);


        /// Implementation
        function initialize() {
            loadSettings();
            loadData();
        }

        function loadSettings() {
            vm.showResultAsDecimal = settings.loadSetting('showResultAsDecimal') || false;
        }

        function loadData() {
            var entity = persistence.entity(dayEntity),
                data = entity.select(time.getCurrentKey());
            if (data) {
                vm.today = dayMapper.mapFromDataEntity(data);
            } else {
                vm.today = defaultValues;
                entity.insert(dayMapper.mapToDataEntity(time.getCurrentKey(), vm.today));
            }

        }

        function editEntry(target) {
            $ionicListDelegate.closeOptionButtons();
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
            vm.today[vm.edited].canUndo = false;
            vm.today[vm.edited].edited = true;

            vm.edited = null;

            save();
        }

        function save() {
            var data = dayMapper.mapToDataEntity(time.getCurrentKey(), vm.today);
            persistence.entity(dayEntity).upsert(data);
        }

        function clearEntry(key) {
            $ionicListDelegate.closeOptionButtons();
            vm.today[key].original = vm.today[key].value;
            vm.today[key].value = null;
            vm.today[key].canUndo = false;
            vm.today[key].edited = true;
            save();
        }

        function setTime(target, isEdit) {
            var now = new Date();
            vm.today[target].value = time.getTimeString(now);
            vm.today[target].canUndo = true;
            save();
            $timeout(function() {
                vm.today[target].canUndo = false;
            }, 10000);
        }

        function canShowTotalHours() {
            return vm.today.arrival.value && vm.today.departure.value;
        }

        function getTotalHours() {
            var totalHours = time.getTotalHours(
                vm.today.arrival.value,
                vm.today.lunchStart.value,
                vm.today.lunchStop.value,
                vm.today.departure.value
            );

            if (vm.showResultAsDecimal) {
                return time.convertToDecimal(totalHours);
            }
            return totalHours;
        }

        function canShowCheckMarkButton(target) {
            switch(target) {
                case 'arrival': return isArrivalButtonAvailable();
                case 'lunchStart': return isLunchStartButtonAvailable();
                case 'lunchStop': return isLunchStopButtonAvailable();
                case 'departure': return isDepartureButtonAvailable();
            }
        }

        function isArrivalButtonAvailable() {
            return !vm.today.arrival.value;
        }

        function isLunchStartButtonAvailable() {
            return vm.today.arrival.value &&
                !vm.today.departure.value &&
                !vm.today.lunchStart.value;
        }

        function isLunchStopButtonAvailable() {
            return vm.today.lunchStart.value && !vm.today.lunchStop.value;
        }

        function isDepartureButtonAvailable() {
            return vm.today.arrival.value &&
                (!vm.today.lunchStart.value || vm.today.lunchStop.value) &&
                !vm.today.departure.value;
        }

        function undo(target) {
            $ionicListDelegate.closeOptionButtons();

            vm.today[target].value = null;
            vm.today[target].timestamp = null;
            vm.today[target].canUndo = false;

            save();
        }

        function hasVisibleButton(key) {
            return canShowCheckMarkButton(key) || vm.today[key].canUndo;
        }

        function toggleShowResultAsDecimal() {
            vm.showResultAsDecimal = !vm.showResultAsDecimal;
        }

        function getTotalDescription() {
            if (vm.showResultAsDecimal) {
                return 'as decimal';
            }
            return 'hours and minutes';
        }
    }
})();
