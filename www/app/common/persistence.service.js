(function() {
    'use strict';

    angular.module('app.common')
        .factory('persistence', persistenceServiceFactory);

    persistenceServiceFactory.inject = ['$window'];
    function persistenceServiceFactory($window) {
        var targetEntityName,
            targetEntity,
            keyStorageEntity = 'entityKeys',
            keys,
            persistenceAPI =  {
                createEntity: createEntity,
                entity: entity,
                hasEntity: hasEntity,
                destroyEntity: destroyEntity
            },
            entityAPI = {
                insert: insert,
                upsert: upsert,
                selectAll: selectAll,
                select: select,
                update: update,
                remove: remove
            };
        initialize();
        return persistenceAPI;

        /// Implementaion
        function initialize() {
            createKeyStorageIfNotExists();
            keys = getEntity(keyStorageEntity);
        }

        function createKeyStorageIfNotExists() {
            if (!getEntity(keyStorageEntity)) {
                setEntity(keyStorageEntity, {});
            }
        }

        /// Persistence API

        function createEntity(entityName, entityKey) {
            if (hasEntity(entityName)) {
                throw new Error('Could not add '+ entityName +', entity already exists');
            }
            saveKey(entityName, entityKey);
            setEntity(entityName, {});
        }

        function getEntity(entityName) {
            return JSON.parse($window.localStorage.getItem(entityName));
        }

        function setEntity(entityName, data) {
            $window.localStorage.setItem(entityName, JSON.stringify(data));
        }

        function saveKey(entityName, entityKey) {
            keys[entityName] = entityKey;
            setEntity(keyStorageEntity, keys);
        }

        function entity(entityName) {
            targetEntityName = entityName;
            targetEntity = getEntity(entityName);
            return entityAPI;
        }

        function hasEntity(entityName) {
            return !!$window.localStorage.getItem(entityName);
        }

        function destroyEntity(entityName) {
            $window.localStorage.removeItem(entityName);
        }

        function saveEntity() {
            setEntity(targetEntityName, targetEntity);
        }

        /// Entity API
        function insert(data) {
            var id = getId(data);
            if (targetEntity[id]) {
                throw new Error("Could not insert since the key already exists");
            }
            targetEntity[id] = data;
            saveEntity();
        }

        function upsert(data) {
            var id  = getId(data);
            if (id in targetEntity) {
                update(data);
            } else {
                insert(data);
            }
        }

        function getId(data) {
            return data[keys[targetEntityName]];
        }

        function selectAll() {
            return Object.keys(targetEntity)
                .map(function(key) {
                    return targetEntity[key];
                });
        }

        function select(id) {
            return targetEntity[id];
        }

        function update(data) {
            var id  = getId(data);
            if (!targetEntity[id]) {
                throw new Error("Could not update since keys does not exist");
            }
            targetEntity[id] = data;
            saveEntity();
        }

        function remove(id) {
            delete targetEntity[id];
            saveEntity();
        }
    }
})();
