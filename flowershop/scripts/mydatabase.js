
(function (global, $data, undefined) {

    $data.define('TravelPreference', {
        'id': { 'key': true, 'type': 'int', 'computed': true },
        'Name': { 'type': Number },
        'Age': { 'type': Number },
        'Reason': { 'type': Number },
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
