
(function (global, $data, undefined) {

    $data.define('TravelPreference', {
        'id': { 'key': true, 'required': true, 'type': 'Edm.Guid', 'computed': false, 'nullable': false },
        'Name': { 'type': String },
        'Age': { 'type': String },
        'Continent': { 'type': String },
        'Reason': { 'type': String },
        'Creation': Date,
        'Sent': Boolean
    });
    
    $data.EntityContext.extend('mydatabase', { 
        'TravelPreferences' : { type: $data.EntitySet, elementType: TravelPreference }
    });
 
    $data('TravelPreference').addEventListener('beforeCreate', function (source, pref) {
        if (!pref.id) {
            pref.id = $data.createGuid();
            pref.Creation = new Date();
        }
    });
})(window, $data);
