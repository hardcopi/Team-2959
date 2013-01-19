    var Category = $data.define("Category", {
        Name: String
    });

    var Task = $data.define("Task", {
        Todo: { type: String, required: true },
        Urgent: Boolean,
        Completed: {type: Boolean, required: true },
        Category_Id: Number
    });

    var TodoDB = $data.EntityContext.extend('TodoDB', {
       Categories: { type: $data.EntitySet, elementType: Category },
       Tasks: { type: $data.EntitySet, elementType: Task} 
    });


    
    var AppSettings = $data.define("AppSettings", {
        useCategories: Boolean,
        useDates: Boolean
    });

    AppSettings.getAppSettings = function(cb) {
        
        function returnItem(item) {
            cb(item.asKendoObservable({autoSave: true}));
        }
        
        function createAppSettingsItem() {
           AppSettings
            .save({ Id: 1, useCategories: false})
            .then(returnItem);
        }

        AppSettings
            .read(1)
            .then(returnItem)
            .fail(createAppSettingsItem);

    }


    

    

    