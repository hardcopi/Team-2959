
(function (global, $data, undefined) {

    var TripSurvey = $data.define('TripSurvey', {
        id: {type: 'int', key: true, computed: true },
        Name: String ,
        AgeGroup: String,
        Reason: String,
        TripDays: Number,
        StaysInHotel: Boolean
    });
    
    global.TripDB = $data.EntityContext.extend('TripDB', { 
        TripAnswers : { type: $data.EntitySet, elementType: TripSurvey }
    });
 
    //TripSurvey.addEventListener('beforeCreate', function (source, entity) {
    //    entity.Creation = new Date();
    //});
    
})(window, $data);
