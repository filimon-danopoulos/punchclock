(function() {
    'use strict';

    angular.module('app.punchclock')
        .factory('dayMappingService', dayMappingServiceFactory);

    dayMappingServiceFactory.inject = ['dayEntityKey', 'punchclockDefaults'];
    function dayMappingServiceFactory(dayEntityKey, punchclockDefaults) {
        return {
            mapToDataEntity: mapToDataEntity,
            mapFromDataEntity: mapFromDataEntity
        };

        function mapToDataEntity(key, day) {
            var data = {};
            data[dayEntityKey] = key;
            Object.keys(day)
                .forEach(function(x) {
                    data[x] = {
                        value: day[x].value,
                        edits: day[x].edits,
                        edited: day[x].edited
                    };
                });
            return data;
        }

        function mapFromDataEntity(entity) {
            var result = punchclockDefaults;

            Object.keys(entity)
                .forEach(function(x) {
                    if (!(x in result)) {
                        return;
                    }
                    result[x].value = entity[x].value;
                    result[x].edits = entity[x].edits;
                    result[x].edited = entity[x].edited;
                });

            return result;
        }
    }
})();
