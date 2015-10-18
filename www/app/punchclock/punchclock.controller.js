(function() {
    'use strict';

    angular.module('app.punchclock')
        .controller('PunchClockController', PunchClockController);

    PunchClockController.$inject = [
        '$scope',
        '$timeout',
        '$ionicModal',
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
            $ionicModal,
            $ionicListDelegate,
            time,
            persistence,
            dayEntity,
            dayEntityKey,
            dayMapper,
            defaultValues,
            settings) {
        var vm = this,
            editModal,
            undoTimer;

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
        vm.closeModal = closeModal;
        vm.saveModalResult = saveModalResult;

        /// Events
        $scope.$on('$ionicView.beforeEnter', initialize);
        $scope.$on('$ionicView.enter', loadModal);
        $scope.$on('$destroy', cleanUp);


        /// Implementation
        function initialize() {
            loadSettings();
            loadData();
        }

        function cleanUp() {
            editModal.remove();
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
                setDefaultValues();
            }
        }

        function setDefaultValues() {
            var entity = persistence.entity(dayEntity);
            vm.today = defaultValues;
            entity.insert(dayMapper.mapToDataEntity(time.getCurrentKey(), vm.today));
        }

        function loadModal() {
            $ionicModal.fromTemplateUrl('app/punchclock/templates/edit-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                editModal = modal;
            });
        }

        function editEntry(target) {
            $ionicListDelegate.closeOptionButtons();
            if (!vm.today[target].value) {
                return;
            }
            vm.edited = target;
            editModal.show();
        }

        function updateData(key, newTime) {
            vm.today[key].edits.push({
                previous: vm.today[key].value,
                new: newTime,
                timestamp: time.getTimeString(new Date())
            });
            vm.today[key].value = newTime;
            vm.today[key].canUndo = false;
            vm.today[key].edited = true;
            save();
        }

        function getTime(newTime) {
            var now = new Date(),
                timeParts = newTime.split(':');
            now.setHours(timeParts[0]);
            now.setMinutes(timeParts[1]);
        }

        function save() {
            var data = dayMapper.mapToDataEntity(time.getCurrentKey(), vm.today);
            persistence.entity(dayEntity).upsert(data);
        }

        function clearEntry(key) {
            $ionicListDelegate.closeOptionButtons();
            updateData(key, null);
        }

        function setTime(target, isEdit) {
            var now = new Date();
            vm.today[target].value = time.getTimeString(now);
            vm.today[target].canUndo = true;
            save();
            startUndoDisableTimer(target);
        }

        function startUndoDisableTimer(target) {
            undoTimer = $timeout(function() {
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
            $timeout.cancel(undoTimer);
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

        function closeModal() {
            editModal.hide();
        }

        function saveModalResult(newValue) {
            editModal.hide();
            newValue = formatNewValue(newValue);
            $timeout.cancel(undoTimer);
            updateData(vm.edited, newValue);

            vm.edited = null;
            vm.newValue = null;
        }

        function formatNewValue(newValue) {
            return newValue.slice(0,2)+':'+newValue.slice(2);
        }
    }
})();
