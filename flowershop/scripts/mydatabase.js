
(function (global, $data, undefined) {

    $data.define('TravelPreference', {
        'id': { 'key': true, 'required': true, 'type': 'Edm.Guid', 'computed': false, 'nullable': false }, // Edm.Int32 'Edm.Guid'
        'Age': Number,
        'Continent': String,
        'Reason': String,
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
