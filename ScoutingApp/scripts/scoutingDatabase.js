    var Category = $data.define("Category", {
        Name: String
    });

    var Robot = $data.define("Robot", {
        Name: String,
        Range: String,
        Elevation: String,
        Reload_Time: String,
        Accuracy: String,
        Height: String,
        Speed: String,
        Drive_Train: String,
        Points_Per_Match: String, 
        Robot_Type: String,
        Vision: String,
        Picture: { type: "blob" },
        Category_Id: Number
    });

    var AppSettings = $data.define("AppSettings", {
        UseCategories: Boolean,
        ShowNewItemInList: Boolean
    });

    var TodoDB = $data.EntityContext.extend('TodoDB', {
       Categories: { type: $data.EntitySet, elementType: Category },
       Robots: { type: $data.EntitySet, elementType: Robot},
       AppSettings: {type: $data.EntitySet, elementType: AppSettings },
        
       
       getAppSettings: function(appSettingReady) {
           var that = this;
           function returnEntity(entity) {
               appSettingReady(entity.asKendoObservable({autoSave: true}));
           }
           
           function createAppSettings() {
               AppSettings.save({Id: 1, UseCategories: false, ShowNewItemInList: true}).then(returnEntity);
           };
           
           return that.AppSettings
               .single("it.Id == 1")
               .fail(createAppSettings)
               .then(returnEntity)
       }
    });

document.addEventListener("deviceready", function() {
	$("#capturePhotoButton").bind("click", function() {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        }); 
    });
    
}, false);

function onSuccess(imageData) {
    $('#smallImage').attr('src', "data:image/jpeg;base64," + imageData);
    viewModel.set("Picture", imageData);
}

function onFail(message) {
    alert('Failed because: ' + message);
}

    

    