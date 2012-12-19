
(function (global, $data, undefined) {

    $data.define('TravelPreference', {
        'id': { 'key': true, 'required': true, 'type': 'Edm.Guid', 'computed': false, 'nullable': false },
        'Name': { 'type': String, 'required': true },
        'Age': { 'type': Number, 'required': true, minValue: 1 },
        'Continent': { 'type': Number, 'required': true },
        'Reason': { 'type': Number, 'required': true },
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
