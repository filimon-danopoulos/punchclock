(function() {
    'use strict';

    angular.module('app.settings', [])
        .constant('settingsEntityKey', 'name')
        .constant('settingsEntity', 'settings')
        .run(run);

    run.$inject = ['persistenceService', 'settingsEntity', 'settingsEntityKey'];
    function run(persistenceService, settingsEntity, settingsEntityKey) {
        if(!persistenceService.hasEntity(settingsEntity)) {
            persistenceService.createEntity(settingsEntity, settingsEntityKey);
        }
    }
})();
