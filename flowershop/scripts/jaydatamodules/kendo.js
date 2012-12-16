(function ($data) {
    $data.Queryable.addMember("asKendoColumns", function (columns) {
        //console.log('col', this, arguments);
        var result = [];
        columns = columns || {};
        this.defaultType
            .memberDefinitions
            .getPublicMappedProperties()
            .forEach(function (pd) {
                if (pd.dataType !== "Array") {
                    console.dir(pd);
                    result.push({
                        field: pd.name
                    });
                }
            });

        function append(field) {
            field = Array.isArray(field) ? field : [field];
            var result = this.concat(field);
            return prepareResult(result);
        }

        function prepend(field) {
            field = Array.isArray(field) ? field : [field];
            var result = field.concat(this);
            return prepareResult(result);
        }
        function prepareResult(r) {
            r.prepend = prepend;
            r.append = append;
            return r;
        }
        return prepareResult(result);
        //return ['id', 'Year', 'Manufacturer', { command: ["edit", "create", "destroy", "update"] }];
    }),

    //, { command: ["edit", "create", "destroy", "update"]}
    $data.EntityContext.addProperty("EntitySets", function () {
        var self = this;
        //var sets = Object.keys(self._entitySetReferences);
        //return sets;
        return Object.keys(self._entitySetReferences).map(function (set) {
            return self._entitySetReferences[set].tableName;
        });
    }); 

    //modelCache = {};
    //transportCache = {};
    //alert($data.EntityContext.addProperty);



    $data.Queryable.addMember("asKendoModel", function () {

        function getKendoTypeName(jayDataTypeName) {
            jayDataTypeName = $data.Container.resolveName(jayDataTypeName);
            switch (jayDataTypeName) {
                case "$data.Blob":
                case "$data.String":
                    return "string";
                case "$data.Boolean":
                    return "boolean";
                case "$data.Integer":
                case "$data.Number":
                    return "number";
                case "$data.Date":
                    return "date";
                default:
                    return 'string'; // TODO ???
                    throw new Error("unimplemented: " + jayDataTypeName);
            }
        };

        var self = this;
        var result = {};

        self.defaultType.memberDefinitions
            .getPublicMappedProperties()
            .forEach(function (pd) {
                result[pd.name] = {
                    type: getKendoTypeName(pd.type),
                    nullable: pd.nullable,
                    editable: !pd.computed,
                    validation: {
                        required: pd.required
                    }
                }
            });

        returnValue = kendo.data.Model.define({
            id: self.defaultType.memberDefinitions.getKeyProperties()[0].name,
            fields: result
            //,
            //init: function () {
            //    kendo.data.Model.apply(this, arguments);
            //}
        });
        console.dir(result);
        return returnValue;
    });
    
    $data.Queryable.addMember("asKendoRemoteTransportClass", function (modelItemClass) {
        var self = this;
        var ctx = self.entityContext;
        function reset() {
            ctx.stateManager.reset();
        };
        var TransportClass =  kendo.data.RemoteTransport.extend({
            init: function () {
                console.log("init");
            },
            read: function (options) {
                var query = self;
                var _this = this;
                reset();
                if (options.data.filter) {

                    console.log(options.data.filter);

                    var filter = "";
                    var thisArg = {};
                    options.data.filter.filters.forEach(function (f, index) {
                        if (index > 0) { filter += options.data.filter.logic == "or" ? " || " : " && "; }

                        console.log(filter, f);

                        switch (f.operator) {
                            case 'eq':
                                filter += "it." + f.field;
                                filter += " == this." + f.field;
                                break;
                            case 'neq':
                                filter += "it." + f.field;
                                filter += " != this." + f.field;
                                break;
                            case 'startswith':
                                filter += "it." + f.field;
                                filter += ".startsWith(this." + f.field + ")";
                                break;
                            case 'contains':
                                filter += "it." + f.field;
                                filter += ".contains(this." + f.field + ")";
                                break;
                            case 'doesnotcontain':
                                filter += "!";
                                filter += "it." + f.field;
                                filter += ".contains(this." + f.field + ")";
                                break;
                            case 'endswith':
                                filter += "it." + f.field;
                                filter += ".endsWith(this." + f.field + ")";
                                break;
                            case 'gte':
                                filter += "it." + f.field;
                                filter += " >= this." + f.field;
                                break;
                            case 'gt':
                                filter += "it." + f.field;
                                filter += " > this." + f.field;
                                break;
                            case 'lte':
                                filter += "it." + f.field;
                                filter += " <= this." + f.field;
                                break;
                            case 'lt':
                                filter += "it." + f.field;
                                filter += " < this." + f.field;
                                break;
                            default:
                                console.log('unknown operator', f.operator);
                                break;
                        }
                        thisArg[f.field] = f.value;
                    })
                    query = query.filter(filter, thisArg);
                }
                if (options.data.sort) {
                    options.data.sort.forEach(function (s) {
                        query = query.order((s.dir == 'desc' ? "-" : "") + s.field);
                    })
                }
                var qcount = query;
                var q = query.skip(options.data.skip).take(options.data.take);
                var ta = q.toArray();
                var l = qcount.length();
                jQuery.when(ta, l).then(function (items, total) {
                    //var result = items.map(function (item) { return item instanceof $data.Entity ? new model(item.initData) : item; });
                    
                    var result = items.map(function (item) {
                        var d = (item instanceof $data.Entity) ? item.initData : item;
                        var kendoItem = new modelItemClass(d);
                        kendoItem.bind("change", function (e) {
                            if (ctx.stateManager.trackedEntities.indexOf(item) < 0) {
                                console.log("attaching");
                                ctx.attach(item);
                            }
                            item[e.field] = this.get(e.field);
                        });
                        return kendoItem;
                    });

                    //result.forEach(function (modelItem) {
                    //    modelItem.bind("change", function () {
                    //        console.log("change event", arguments);
                    //    });
                    //    modelItem.bind("get", function () {
                    //        console.log("get event", arguments);
                    //    });
                    //    modelItem.bind("set", function () {
                    //        console.log("set event", arguments);
                    //    });

                    //});
                    //console.log({ data: result, total: total });
                    //xxxx = result;
                    options.success({ data: result, total: total });
                });
            },
            create: function (options) {
                console.log("create");
                console.dir(arguments);
                var jayType = self.defaultType;
                var d = options.data;
                if ("models" in d) {
                    d = d.models;
                };
                if (!(Array.isArray(d))) {
                    d = [d];
                }
                var jd = d.map(function (data) { return new jayType(data); });
                ctx.addMany(jd);
                //var jayInstance = new jayType(options.data);
                //ctx.add(jayInstance);
                ctx.saveChanges().then(function () {
                    //var kendoItem = new modelItemClass(jayInstance.initData);
                    var data = jd.map(function (j) { return j.initData });
                    options.success({ "data": data });
                });
                
            },
            update: function (options) {
                
                console.log("update"); console.dir(arguments);
                ctx.saveChanges().then(function () {
                    //options.data.FullName = 'a';
                    options.success(options.data);
                }).fail(function () {
                    alert("error");
                    options.error();
                });
                //self.toArray(function () {
                //});
                //return false;
            },

            destroy: function (options) {
                //alert("!");

                console.log("delete");
                console.dir(arguments);
                var jayType = self.defaultType;
                var d = options.data;
                if ("models" in d) {
                    d = d.models;
                };
                if (!(Array.isArray(d))) {
                    d = [d];
                }
                var jd = d.map(function (data) { return new jayType(data); });
                jd.forEach(function (j) {
                    ctx.remove(j);
                });
                ctx.saveChanges()
                    .then(function () {
                        options.success({});
                    })
                    .fail(function () {
                        options.error();
                    });
                
                
                //console.log("destroy"); console.dir(arguments);
                //self.toArray(function () {
                //    options.error(options.data, "OK", "Something");
                //});
                //var d = new $.Deferred();
                //return d.promise();
            },
            setup: function () { console.log("setup"); console.dir(arguments); }
        });
        return TransportClass;
    });

    $data.Queryable.addMember("asKendoDataSource", function (ds) {
        var self = this;

        var model = self.asKendoModel();

        ds = ds || {};
        //unless user explicitly opts out server side logic
        //we just force it.
        ds.serverPaging = ds.serverPaging || true;
        ds.serverFiltering = ds.serverFiltering || true;
        ds.serverSorting = ds.serverSorting || true;
        ds.pageSize = ds.pageSize || 25;

        var TransportClass = self.asKendoRemoteTransportClass(model);
        ds.transport = new TransportClass();

        ds.schema = {
            model: model,
            data: "data",
            total: "total"
        };
        console.log(ds);
        return ds;
    });
})($data);
