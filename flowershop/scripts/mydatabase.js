
(function (global, $data, undefined) {

    $data.define('TravelPreference', {
        'id': { 'key': true, 'type': 'int', 'computed': true },
        'Name': { 'type': String },
        'AgeGroup': { 'type': String },
        'Reason': { 'type': String },
        'Creation': Date,
        'Sent': Boolean
    });
    
    $data.EntityContext.extend('mydatabase', { 
        'TravelPreferences' : { type: $data.EntitySet, elementType: TravelPreference }
    });
 
    $data('TravelPreference').addEventListener('beforeCreate', function (source, pref) {
        pref.Creation = new Date();
    });
    
})(window, $data);
