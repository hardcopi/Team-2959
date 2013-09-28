(function ($data) {

    kendo.data.binders.submit = kendo.data.Binder.extend({ 
        init: function(element, bindings, options) {
            kendo.data.Binder.fn.init.call(this, element, bindings, options);
            $(element).bind("submit", function() {
                var obj = bindings.submit.source;
                var fn = obj[bindings.submit.path];
                if (typeof fn === 'function') {
                    fn.apply(obj, arguments);
                    return false;
                }
                
            });
        },            
        refresh: function() {      
        }
    });

    var oldProcessor = $data.Entity.inheritedTypeProcessor;
    $data.kendo = {};
    $data.kendo.BaseModelType = kendo.data.Model.define({
        init: function (data) {
            kendo.data.Model.fn.init.call(this, data);
        }
    });
    
    $data.Entity.inheritedTypeProcessor = function (type) {

        var memberDefinitions = type.memberDefinitions;

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
                    return 'object'; // TODO ???
            }
        };


        function createKendoModel(options) {
            ///<param name="options">Contains options.owningContextType if initialized in a scope of a context</param>
            var memberDefinitions = type.memberDefinitions,
                fields = {};
            //debugger;
            memberDefinitions
                .getPublicMappedProperties()
                .forEach(function (pd) {
                    //if (pd.dataType !== "Array" && !(pd.inverseProperty)) {
                    fields[pd.name] = {
                        type: getKendoTypeName(pd.type),
                        //nullable:  "nullable" in pd ? pd.nullable : true,
                        editable: !pd.computed,
                        defaultValue: null,
                        //defaultValue: undefined,
                        //defaultValue: pd.type === "Edm.Boolean" ? true : undefined,
                        validation: {
                            required: pd.required || "nullable" in pd ? !(pd.nullable) : false
                        }
                    }
                    
                    //};
                });

            function setInitialValue(obj, memDef) {
                if (!obj[memDef.name]) {
                    function getDefault() {
                        switch ($data.Container.resolveType(memDef.type)) {
                            case $data.Number: return 0.0;
                            case $data.Integer: return 0;
                            case $data.Date: return new Date();
                            case $data.Boolean: return false;
                        }
                    }

                    obj[memDef.name] = getDefault();

                }
            }

            //console.dir(memberDefinitions.getPublicMappedMethods());
            var modelDefinition = {
                fields: fields,
                init: function (data) {
                    //console.dir(arguments);

                    var ctxType = options && options.owningContextType || undefined;

                    var contextSetTypes = [];
                    if (options && options.owningContextType) {
                        contextSetTypes = options.owningContextType
                                                     .memberDefinitions
                                                     .getPublicMappedProperties()
                                                     .filter(function (pd) { return $data.Container.resolveType(pd.type) === $data.EntitySet })
                                                     .map(function (pd) { return $data.Container.resolveType(pd.elementType) });

                    }

                    var newInstanceOptions = {
                        entityBuilder: function (instance, members) {
                            members.forEach(function (memberInfo) {
                                if ( !(memberInfo.key === true) && (memberInfo.required === true || memberInfo.nullable === false)) {
                                    var memberType = $data.Container.resolveType(memberInfo.type);
                                    if (memberType.isAssignableTo && memberType.isAssignableTo($data.Entity) && contextSetTypes.indexOf(memberType) === -1) {
                                        //it's a complex property
                                        instance[memberInfo.name] = new memberType({}, newInstanceOptions);
                                    } else {
                                        setInitialValue(instance, memberInfo);
                                    }
                                }
                            });
                        }
                    }

                    var jayInstance = data instanceof type ? data : new type(data, newInstanceOptions);
                    //debugger;
                    //debugger;
                    //fill up complex types props

                    //type.memberDefinitions
                    //


                    var seed = jayInstance.initData;

                    var feed = {};
                    //TODO create precompiled strategy
                    for (var j in seed) {
                        var md = type.getMemberDefinition(j);
                        var seedValue = seed[j];
                        if (seedValue instanceof $data.Entity) {
                            var kendoInstance = seedValue.asKendoObservable();
                            feed[j] = kendoInstance;
                        } else if (md && md.type === "Array") {
                            var jayType = $data.Container.resolveType(md.elementType);
                            var kendoType = jayType.asKendoModel();
                            var feedValue = new kendo.data.ObservableArray(seed[j], kendoType);
                            feed[j] = feedValue;
                        } else {
                            feed[j] = seedValue;
                        }
                    }

                    var self = this;
                    this.innerInstance = function () { return jayInstance }



                    //kendo.data.Model.fn.init.call(this, feed);
                    $data.kendo.BaseModelType.fn.init.call(this, feed);
                    
                    jayInstance.propertyChanged.attach(function (obj, propinfo) {
                        var jay = this;
                        var newValue = propinfo.newValue;
                        if (!jay.changeFromKendo) {
                            newValue = newValue.asKendoObservable ? newValue.asKendoObservable() : newValue
                            jayInstance.changeFromJay = true;
                            self.set(propinfo.propertyName, propinfo.newValue);
                            delete jayInstance.changeFromJay;
                        }
                    });

                    this.bind("set", function (e) {
                        var propName = e.field;
                        var propNameParts = propName.split(".");
                        jayInstance.changeFromKendo = true;
                        if (propNameParts.length == 1) {
                            var propValue = e.value;
                            if (!jayInstance.changeFromJay) {
                                propValue = propValue.innerInstance ? propValue.innerInstance() : propValue;
                                jayInstance[propName] = propValue;
                                if (options && options.autoSave) {
                                    jayInstance.save();
                                }
                            }
                        } else {
                            var rootProp = jayInstance[propNameParts[0]];
                            //if (!jayInstance.changeFromJay) {
                                if (rootProp instanceof $data.Entity) {
                                    jayInstance[propNameParts[0]] = rootProp;
                                }
                            //}
                        }
                        delete jayInstance.changeFromKendo;
                        //var parts = e.field.split('.');
                        //if (parts.length == 1) {
                        //    var origValue = jayInstance[e.field];
                        //    var value = value.innerInstance ? value.innerInstance() : value;
                        //    if (origValue !== e.value) {
                        //        jayInstance[e.field] = e.value;
                        //    }
                        //} else {
                            
                        //    //if (jayInstance[parts[0]][parts[1]] instanceof $data.)
                        //}
                    });
                    if (options && options.newInstanceCallback) {
                        options.newInstanceCallback(jayInstance);
                    }


                    //var self = this;

                    //this.save = function () {
                    //    return self.innerInstance().save();
                    //};
                    //this.remove = function () {
                    //    return self.innerInstance().remove();
                    //};
                },
                save: function () {
                    console.log("item.save", this, arguments);
                    return this.innerInstance().save();
                },
                remove: function () {
                    return this.innerInstance().remove();
                }

            };

            var keyProperties = memberDefinitions.getKeyProperties();
            switch (keyProperties.length) {
                case 0:
                    break;
                case 1:
                    modelDefinition.id = keyProperties[0].name;
                    break;
                default:
                    console.warn("entity with multiple keys not supported");
                    break;
            }

            var returnValue = kendo.data.Model.define($data.kendo.BaseModelType, modelDefinition);
            //TODO align with kendoui concept
            //for (var j in returnValue.prototype.defaults) {
            //    returnValue.prototype.defaults[j] = undefined;
            //}
            //console.log("default", returnValue.prototype.defaults)
            return returnValue;
        }

        function asKendoModel(options) {
            var cacheObject = options || type;
            return cacheObject.kendoModelType || (cacheObject.kendoModelType = createKendoModel(options));
        }

        function asKendoObservable(instance, options) {

            var kendoModel = type.asKendoModel(options);
            return new kendoModel(instance);
        }

        type.asKendoModel = asKendoModel;

        type.prototype.asKendoObservable = function (options) {
            var self = this;

            var kendoObservable = asKendoObservable(this, options);

            return kendoObservable;
        }

        if (oldProcessor) {
            oldProcessor(type);
        }
    }
    $data.Queryable.addMember("asKendoColumns", function (columns) {
        //console.log('col', this, arguments);
        var result = [];
        columns = columns || {};
        this.defaultType
            .memberDefinitions
            .getPublicMappedProperties()
            .forEach(function (pd) {
                //if (pd.dataType !== "Array" && !(pd.inverseProperty)) {
                var col = (columns[pd.name] ? columns[pd.name] : {});
                var colD = { field: pd.name };
                $.extend(colD, col)
                result.push(colD);
                //}
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

        function setColumn(colName, def) {
            var it = this.filter(function (item) { return item.field == colName })[0];
            $.extend(it, def);
            return this;
        }


        function prepareResult(r) {
            r.prepend = prepend;
            r.append = append;
            r.setColumn = setColumn;
            return r;
        }
        return prepareResult(result);
        //return ['id', 'Year', 'Manufacturer', { command: ["edit", "create", "destroy", "update"] }];
    }),

    //, { command: ["edit", "create", "destroy", "update"]}
    $data.EntityContext.addProperty("EntitySetNames", function () {
        var self = this;
        //var sets = Object.keys(self._entitySetReferences);
        //return sets;
        return Object.keys(self._entitySetReferences).map(function (set) {
            return self._entitySetReferences[set].tableName;
        });
    });


    $data.Queryable.addMember("asKendoModel", function (options) {
        options.owningContextType = options.owningContextType || this.entityContext.getType();
        return this.defaultType.asKendoModel(options);
    });

    $data.Queryable.addMember("asKendoRemoteTransportClass", function (modelItemClass) {
        var self = this;
        var ctx = self.entityContext;
        function reset() {
            ctx.stateManager.reset();
        };
        var TransportClass = kendo.data.RemoteTransport.extend({
            init: function () {
                this.items = [];
            },
            read: function (options) {
                var query = self;
                var _this = this;
                if (options.data.filter) {

                    //console.log(options.data.filter);

                    var filter = "";
                    var thisArg = {};
                    options.data.filter.filters.forEach(function (f, index) {
                        if (index > 0) { filter += options.data.filter.logic == "or" ? " || " : " && "; }

                        //console.log(filter, f);

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
                //Data.defaultHttpClient.enableJsonpCallback = true;
                var ta = q.toArray();
                var l = qcount.length();
                jQuery.when(ta, l).then(function (items, total) {
                    //var result = items.map(function (item) { return item instanceof $data.Entity ? new model(item.initData) : item; });
                    var result = items.map(function (item) {
                        var d = (item instanceof $data.Entity) ? item.initData : item;
                        var kendoItem = item.asKendoObservable();
                        return kendoItem;
                    });

                    options.success({
                        data: result,
                        total: total
                    });
                });
            },
            create: function (options, model) {

                if (model.length > 1) {
                    var modelItems = [];
                    model.forEach(function (modelItem) {
                        modelItems.push(modelItem.innerInstance());
                    });
                    ctx.addMany(modelItems);
                    ctx.saveChanges().then(function () {
                        var data = [];
                        modelItems.forEach(function (modelItem) {
                            data.push(modelItem.initData);
                        });
                        options.success({ data: data });
                    }).fail(function () {
                        console.log("error in create");
                        options.error({}, arguments);
                        ctx.stateManager.reset();
                    });
                } else {
                    //console.log("save single");
                    model[0]
                        .innerInstance()
                        .save()
                        .then(function () {
                            options.success({ data: model[0].innerInstance().initData });
                        });
                }
            },
            update: function (options, model) {
                //console.log("update");
                //console.dir(arguments);

                if (model.length > 1) {
                    var items = model.map(function (item) { return item.innerInstance() });
                    items.forEach(function (item) {
                        ctx.attach(item, true);
                    });
                    ctx.saveChanges().then(function () {
                        options.success();
                    }).fail(function () {
                        ctx.stateManager.reset();
                        alert("error in batch update");
                        options.error({}, "error");
                    });
                } else {
                    model[0].innerInstance().save().then(function (item) {
                        options.success();
                    }).fail(function () { alert("error in update") });
                }
            },

            destroy: function (options, model) {
                if (model.length > 1) {
                    model.forEach(function (item) {
                        ctx.remove(item.innerInstance());
                    });
                    ctx.saveChanges().then(function () {
                        options.success({ data: options.data });
                    }).fail(function () {
                        ctx.stateManager.reset();
                        alert("error in save:" + arguments[0]);
                        options.error({}, "error", options.data);
                    });
                } else {
                    model[0].innerInstance().remove().then(function () {
                        options.success({ data: options.data });
                    }).fail(function () {

                    });
                }
            },
            setup: function () {
                console.log("setup");
                console.dir(arguments);
            }
        });
        return TransportClass;
    });

    var jayDataSource = kendo.data.DataSource.extend({
        init: function () {
            kendo.data.DataSource.fn.init.apply(this, arguments);
        },
        createItem: function (initData) {
            var type = this.options.schema.model;
            return new type(initData);
        },
        _promise: function (data, models, type) {
            var that = this,
                extend = $.extend,
                transport = that.transport;

            return $.Deferred(function (deferred) {
                transport[type].call(transport, extend({
                    success: function (response) {
                        deferred.resolve({
                            response: response,
                            models: models,
                            type: type
                        });
                    },
                    error: function (response, status, error) {
                        deferred.reject(response);
                        that.error(response, status, error);
                    }
                }, data), models
                );
            }).promise();
        },
    });

    $data.Queryable.addMember("asKendoDataSource", function (ds) {
        var self = this;

        var model = self.asKendoModel({
            newInstanceCallback: function () {  }
        });

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
        return new jayDataSource(ds);
    });
})($data);