(function() {
    'use strict';

    angular.module('app.punchclock', [])
        .constant('dayEntityKey', 'date')
        .constant('dayEntity', 'day')
        .run(run);

    run.$inject = ['persistenceService', 'dayEntity', 'dayEntityKey'];
    function run(persistence, dayEntity, dayEntityKey) {
        if(!persistence.hasEntity(dayEntity)) {
            persistence.createEntity(dayEntity, dayEntityKey);
        }
    }
})();
