    var Category = $data.define("Category", {
        Name: String
    });

    var Task = $data.define("Task", {
        Todo: String,
        Urgent: Boolean,
        Completed: {type: Boolean, required: true },
        Category_Id: Number
    });

    var AppSettings = $data.define("AppSettings", {
        UseCategories: Boolean,
        ShowNewItemInList: Boolean
    });

    var TodoDB = $data.EntityContext.extend('TodoDB', {
       Categories: { type: $data.EntitySet, elementType: Category },
       Tasks: { type: $data.EntitySet, elementType: Task},
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


    

    

    