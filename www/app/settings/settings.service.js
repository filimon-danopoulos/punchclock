(function() {
    'use strict';

    angular.module('app.settings')
        .factory('settingsService', settingsServiceFActory);

    settingsServiceFActory.inject = ['persistenceService', 'settingsEntity', 'settingsEntityKey'];
    function settingsServiceFActory(persistenceService, settingsEntity, settingsEntityKey) {
        return {
            saveSetting: saveSetting,
            loadSetting: loadSetting,
            loadSettings: loadSettings
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

        function loadSettings() {
            var settings = {};
            persistenceService.entity(settingsEntity)
                .selectAll()
                .forEach(function(x) {
                    settings[x.name] = x.value;
                });
            return settings;
        }
    }
})();
