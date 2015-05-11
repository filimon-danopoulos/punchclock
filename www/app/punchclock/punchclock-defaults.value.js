(function() {
    'use strict';
    var punchclockDefaults = {
        arrival: {
            order: 1,
            description: 'Arrived at the office',
            value: null,
            canUndo: false,
            edited: false,
            orgininal: null
        },
        lunchStart: {
            order: 2,
            description: 'Went for lunch',
            value: null,
            canUndo: false,
            edited: false,
            orgininal: null
        },
        lunchStop: {
            order: 3,
            description: 'Came back from lunch',
            value: null,
            canUndo: false,
            edited: false,
            orgininal: null
        },
        departure: {
            order: 4,
            description: 'Work\'s out for today!',
            value: null,
            canUndo: false,
            edited: false,
            orgininal: null
        }
    };

    angular.module('app.punchclock')
        .value('punchclockDefaults', punchclockDefaults);
})();
