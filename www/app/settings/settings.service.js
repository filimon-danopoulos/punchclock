(function() {
    'use strict';

    angular.module('app.settings')
        .factory('settingsService', settingsServiceFActory);

    settingsServiceFActory.inject = ['persistenceService', 'settingsEntity', 'settingsEntityKey'];
    function settingsServiceFActory(persistenceService, settingsEntity, settingsEntityKey) {
        return {
            saveSetting: saveSetting,
            loadSetting: loadSetting
        };

        function saveSetting(name, value) {
            var data = {
                value: value,
                name: name
            };
            persistenceService.entity(settingsEntity).upsert(data);
        }

        function loadSetting(name) {
            var setting = persistenceService.entity(settingsEntity).select(name);
            return (setting ? setting.value : null);
        }
    }
})();
