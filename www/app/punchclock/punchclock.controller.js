(function() {
    'use strict';

    angular.module('app.punchclock')
        .controller('PunchClockController', PunchClockController);

    PunchClockController.$inject = [
        '$scope',
        '$timeout',
        '$ionicPopup',
        'timeCalculationService',
        'persistence',
        'dayEntity',
        'dayEntityKey',
        'dayMappingService',
        'punchclockDefaults'
    ];
    function PunchClockController(
            $scope,
            $timeout,
            $ionicPopup,
            time,
            persistence,
            dayEntity,
            dayEntityKey,
            dayMapper,
            defaultValues) {
        var vm = this,
            editModal;

        /// Actions
        vm.editEntry = editEntry;
        vm.setTime = setTime;
        vm.getTodayActivities = getTodayActivities;
        vm.canShowTotalHours = canShowTotalHours;
        vm.getTotalHours = getTotalHours;
        vm.canShowCheckMarkButton = canShowCheckMarkButton;
        vm.hasVisibleButton = hasVisibleButton;
        vm.undo = undo;

        /// Initialize
        initialize();
        /// Implementation
        function initialize() {
            loadData();
        }

        function loadData() {
            var entity = persistence.entity(dayEntity),
                data = entity.select(getCurrentKey());
            if (data) {
                vm.today = dayMapper.mapFromDataEntity(data);
            } else {
                vm.today = defaultValues;
                entity.insert(dayMapper.mapToDataEntity(getCurrentKey(), vm.today));
            }

        }

        function getCurrentKey() {
            var date = new Date();
            return date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
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

            save();
        }


        function save() {
            var data = dayMapper.mapToDataEntity(getCurrentKey(), vm.today);
            persistence.entity(dayEntity).upsert(data);
        }

        function setTime(target, isEdit) {
            var now = new Date();
            vm.today[target].value = time.getTimeString(now);
            vm.today[target].timestamp = +now;
            vm.today[target].canUndo = true;
            save();
            $timeout(function() {
                vm.today[target].canUndo = false;
            }, 10000);
        }


        function getTodayActivities() {
            return Object.keys(vm.today)
                .sort(function(a, b) {
                    return vm.today[a].order - vm.today[b].order;
                });
        }

        function canShowTotalHours() {
            return vm.today.arrival.value && vm.today.departure.value;
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
            vm.today[target].value = null;
            vm.today[target].timestamp = null;
            vm.today[target].canUndo = false;

            save();
        }

        function hasVisibleButton(key) {
            return canShowCheckMarkButton(key) || vm.today[key].canUndo;
        }
    }
})();
