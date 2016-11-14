Ext.define('CSVDEMO.view.main.FileController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.file',
    uses: [
        "Ext.window.MessageBox"
    ],
    init: function(view) {
        var ctrl = this;
        ctrl.mainView = view.up('app-main');
        ctrl.vGrid = view.down('templatevalidationrulespanel');

        this.control({
            "filepanel": {
                "afterrender": {
                    fn: this.filePanelAfterRender,
                    scope: view
                }
            },
            "combo[itemId='vendorCombo']": {
                "select": {
                    fn: this.vendorComboSelect,
                    scope: view
                }
            },
            "combo[itemId='typeCombo']": {
                "select": {
                    fn: this.typeComboSelect,
                    scope: view
                }
            },
            "filecontrolform filefield": {
                "change": {
                    fn: function(cmp, value, opts) {

                        var me = this.view,
                            ctrl = this.ctrl,
                            main = cmp.up('app-main'),
                            inputFileEl, fReader,
                            msgPrefix = "Loading File: ", fileName,
                            inputFileEl = cmp.getEl().select("input[type='file']").elements[0],
                            fileName = inputFileEl.files[0].name;

                        cmp.setRawValue(fileName);
                        if(window.File && window.FileReader && window.FileList && window.Blob) {
                            main.mask(msgPrefix + fileName);
                            fReader = new FileReader();
                            fReader.readAsText(inputFileEl.files[0]);
                            fReader.onloadend = function(e) {
                                var dataContent = e.target.result;
                                me.dataContent = dataContent;
                               // console.log(dataContent);
                                window.setTimeout(function() {
                                    main.unmask();
                                    ctrl.processFile(me);
                                }, 100);
                            }
                            fReader.onerror = function(e) {
                                main.unmask();
                                Ext.Msg.alert("Error", "An Error has occurred when loading file: ", fileName);
                            }
                        } else {
                            Ext.Msg.alert("Warning", "This browser doesn't support the HTML5 File API.");
                        }
                    },
                    scope: {
                        view: view,
                        ctrl: ctrl
                    }
                }
            },
            "filecontrolform button[action='clear']": {
                "click": {
                    fn: function(btn) {
                        btn.up('form').getForm().reset();
                        this.validationRules.reset.call(this);
                    },
                    scope: ctrl
                }
            }
        })
    },
    //filePanelAfterRender: function(cmp) {
    //    var me = this;
    //    Ext.Ajax.request({
    //        url: "resources/validation_templates/TypeProductData.json",
    //        success: function(resp, respOpts) {
    //            var me = this;
    //            var data = Ext.decode(resp.responseText);
    //            var store;
    //            var combo;
    //            if(data.success == true) {
    //                data = data.data;
    //                me.comboData = data;
    //                combo = me.down('combo');
    //                store = combo.getStore();
    //                store.removeAll();
    //                store.loadData(data.vendor);
    //                combo.next().getStore().removeAll();
    //                // combo.expand();
    //            }
    //        },
    //        scope: me
    //    });
    //},
    filePanelAfterRender: function(cmp) {
        var me = this;
        Ext.Ajax.request({
            url: "resources/validation_templates/Generic.json",
            success: function(resp, respOpts) {
                var me = this;
                var data = Ext.decode(resp.responseText);
                if(data.success == true) {
                    data = data.data;
                    me.vTpl = data;
                }
            },
            scope: me
        });
    },
    typeComboSelect: function(cmb, rec) {
        var val = rec.data.file;
        var prevCmb = cmb.prev();
        var vendor = prevCmb.getValue();
        var prefix = "resources/validation_templates/";
        var pathAndFileTpl = "{0}/{1}";
        var pathAndFile = Ext.String.format(pathAndFileTpl, vendor, val);
        var fullPath = prefix + pathAndFile;
        alert("Load Template Validation Rules: \n" + fullPath);
    },
    vendorComboSelect: function(cmb, rec) {
        var nextCmb = cmb.next();
        var val = rec.data.key;
        var comboData = this.comboData.type;
        var typeData = comboData[val];
        var store = nextCmb.getStore();
        store.removeAll();
        store.loadData(typeData);
        // nextCmb.expand();
    },
    processRules: function(view) {
        var ctrl = this,
            vr = ctrl.validationRules,
            vGrid = ctrl.vGrid,
            vGridStore = vGrid.getStore(),
            rule, records = vGridStore.data.items,
            l = records.length, x, rec, pass,
            defState = "inprogress",
            msg, result, hardFailure, lastRyleType, cacheResult;
        // get all the rules from vGridStore
        if(l) {
            for(x = 0; x < l; x++) {
                rec = records[x];
                rec.set("state", "inprogress");
                rec.commit();
                rule = rec.data.ruleObj;
                pass = x + 1;
                msg = "Pass " + pass + ": " + rule.shortDesc;
                ctrl.mainView.mask(msg);
                result = vr[rule.type](rule, rec, ctrl, view, pass);
                rec.set("state", result.state);
                rec.commit();
                if(rule.onFailure == "stop" && result.state == "failure") {
                   // Ext.Msg.alert("Failure", result.errMsg.join("<br/>"));
                    hardFailure = true;
                    lastRuleType = rule.type;
                    cacheResult = Ext.clone(result);
                    break;
                } else {
                    if(result.state == "failure") {
                        hardFailure = false;
                        lastRuleType = rule.type;
                        cacheResult = Ext.clone(result);
                    }
                }
            }
            var officialResult = (cacheResult) ? cacheResult : result;

            PUBSUB.pub("resetContent", {data: true});

            if(!hardFailure) {
                PUBSUB.pub("setFullReport", {data: {
                    vr: vr,
                    fileCtrl: ctrl,
                    vGridStore: vGridStore,
                    failure: officialResult.state,
                    result: officialResult
                }});

                if(officialResult.state == "success") {
                    PUBSUB.pub("setJSONOutput", {data: {
                        vr: vr,
                        fileCtrl: ctrl,
                        vGridStore: vGridStore,
                        failure: officialResult.state,
                        result: officialResult
                    }});
                }

            } else {
                for(y = x + 1; y < l; y++) {
                    rec = records[y];
                    rec.set("state", "cancel");
                    rec.commit();
                }
                if(lastRuleType == "dataStructureIntegrity") {
                    PUBSUB.pub("setDataStructureIntegrityReport", {data: {
                        vr: vr,
                        fileCtrl: ctrl,
                        vGridStore: vGridStore,
                        result: cacheResult
                    }});
                } else {
                    if(lastRuleType == "columnHeaderIntegrity") {
                        PUBSUB.pub("setColumnHeaderIntegrityReport", {data: {
                            vr: vr,
                            fileCtrl: ctrl,
                            vGridStore: vGridStore,
                            result: cacheResult
                        }});
                    }
                }
            }
            PUBSUB.pub("setOriginalCSV", {data: {
                vr: vr,
                fileCtrl: ctrl,
                vGridStore: vGridStore
            }});
        }
    },
    processFile: function(view) {
        var ctrl = this;
        var vr = ctrl.validationRules;

        vr.reset.call(ctrl);
        vr.setAll(ctrl, view);
        var result = vr.initialization.call(ctrl);
        if(result.success == true) {
          //  console.log("init success");
            window.setTimeout(function() {
                ctrl.mainView.unmask();
                ctrl.processRules(view);
            }, 100);
        } else {
            ctrl.mainView.unmask();
            Ext.Msg.alert("Warning", result.errMsg);
        }
    },
    mainView: null,
    vGrid: null,
    validationResults: {

    },
    validationData: {
        headers: [],
        rows: [],
        columns: [],
        columnHeaders: {
            byIndex: [],
            byHeader: {}
        }
    },
    allData: {
        vData: null,
        rules: null,
        oData: null
    },
    validationRules: {
        "reset": function(view) {
            this.validationData = {};
            this.validationData.headers = [];
            this.validationData.rows = [];
            this.validationData.columns = [];
            this.validationData.columnHeaders = {
                byIndex: [],
                byHeader: {}
            };

            this.allData = {};
            this.allData.vData = null;
            this.allData.rules = null;
            this.allData.oData = null;

            this.validationResults = {};
            this.vGrid.getStore().removeAll();
            PUBSUB.pub("resetContent", {data: true});
        },
        "setAll": function(scope, view) {
            scope.allData.vData = scope.validationData;
            scope.allData.rules = view.vTpl;
            scope.allData.oData = view.dataContent;
        },
        "initialization": function() {
            var ctrl = this,
                vData = ctrl.allData.vData,
                oData = ctrl.allData.oData,
                rules = ctrl.allData.rules,
                vGrid = ctrl.vGrid,
                vGridStore = vGrid.getStore(),
                tempRows = oData.split("\n"),
                pushedRows = [],
                l = tempRows.length,
                x, firstRow, temp, data, colHeaders, row, column, cells, cell, y, ll, rule, ruleData, headers;

            ctrl.mainView.mask("Initialization");

            // pass one, to look only for rows which have potential data
            // if a row is empty, it will have only 1 character, the "\n".

            if(l) {
                for(x = 0; x < l; x++) {
                    if(tempRows[x].length > 1) {
                        pushedRows.push(tempRows[x]);
                    }
                }
                if(pushedRows.length) {
                    // first pass is successfully
                    // second pass
                    // the first row is assumed to be the header/title row
                    // extract it and shove it into
                    firstRow = pushedRows.shift();
                    temp = firstRow.split(",");
                    l = temp.length;
                    colHeaders = vData.columnHeaders;
                    headers = vData.headers;
                    for(x = 0; x < l; x++) {
                        data = Ext.String.trim(temp[x]);
                        headers.push(data);
                        colHeaders.byIndex.push({
                            header: data,
                            data: []
                        });
                        colHeaders.byHeader[data] = {
                            index: x,
                            data: []
                        }
                    }
                    // third pass is to store data by rows and by columns, all under this pass
                    // building several matrices of data
                    l = pushedRows.length;

                    for(x = 0; x < l; x++) {
                        row = pushedRows[x];
                        cells = row.split(",");
                        ll = cells.length;
                        for(y = 0; y < ll; y++) {
                            cell = Ext.String.trim(cells[y]);
                            if(!vData.rows[x]) {
                                vData.rows[x] = {};
                            }
                            if(!vData.rows[x].col) {
                                vData.rows[x].col = [];
                                vData.rows[x].check = true;
                                vData.rows[x].pass = {}
                            }
                            vData.rows[x].col[y] = {
                                data: cell,
                                pass: {}
                            };
                            if(vData.columnHeaders.byIndex[y] && vData.columnHeaders.byIndex[y].data) {
                                vData.columnHeaders.byIndex[y].data.push({
                                    data: cell,
                                    pass: {}
                                });

                                vData.columnHeaders.byHeader[vData.columnHeaders.byIndex[y].header].data.push({
                                    data: cell,
                                    pass: {}
                                });
                            }

                            if(!vData.columns[y]) {
                                vData.columns[y] = [];
                            };
                            vData.columns[y].push(cell);
                        }
                    }

                    // pre-populate the Template Validation Rules grid
                    l = Ext.Object.getSize(rules.rules);
                    ruleData = [];
                    for(x = 1; x <= l; x++) {
                        rule = rules.rules[x];
                        ruleData.push({
                            pass: x,
                            desc: rule.shortDesc,
                            state: "pending",
                            count: "",
                            ruleObj: rule
                        });
                    }
                    vGridStore.loadData(ruleData);

                    return {
                        success: true,
                        errMsg: ""
                    };

                } else {
                    return {
                        success: false,
                        errMsg: "No meaningful data to process."
                    };
                }

            } else {
                return {
                    success: false,
                    errMsg: "Empty file."
                };
            }

        },
        "columnHeaderIntegrity": function(rule, rec, ctrl, view, pass) {

            var expectedColumns = rule.expectedColumns;
            var vData = ctrl.validationData;
            var headers = vData.headers;

            var result = {
                state: "success",
                errMsg: [],
                expectedCount: expectedColumns.length,
                actualCount: headers.length,
                expectedHeaders: expectedColumns,
                actualHeaders: headers,
                rule: rule,
                pass: pass
            };

            var l = headers.length;
            var x;
            // first pass, should have identical column counts.
            if(expectedColumns.length == headers.length) {
                for(x = 0; x < l; x++) {
                    if(!Ext.Array.contains(expectedColumns, headers[x])) {
                        Ext.apply(result, {
                            state: "failure",
                            errMsg: ["Expected columns header title not matching actual header title"]
                        });
                        break;
                    }
                }
            } else {
                Ext.apply(result, {
                    state: "failure",
                    errMsg: ["Expected columns count not matching actual columns count."]
                });
            }
            ctrl.mainView.unmask();
            rec.set('result', result);
            rec.commit();

            return result;
        },
        "dataStructureIntegrity": function(rule, rec, ctrl, view, pass) {
            var result = {
                state: "success",
                errMsg: [],
                rule: rule,
                pass: pass
            };

            var vData = ctrl.validationData;
            var headers = vData.headers;
            var count = headers.length;
            var rows = vData.rows;
            var l = rows.length;
            var x;
            var row;
            var col;
            var errMsg;
            var errMsgTpl = "Expected Count of columns for row: {0} and actual count of columns for row: {1}";
            var failureCount = 0;
            for(x = 0; x < l; x++) {
                row = rows[x];
                col = row.col;
                if(count == col.length) {
                    row.check = true;
                    row.pass[pass] = {
                        check: true,
                        errMsg: []
                    };
                } else {
                    row.check = false;
                    failureCount++;
                    errMsg = Ext.String.format(errMsgTpl, count, col.length);
                    row.pass[pass] = {
                        check: false,
                        errMsg: [errMsg]
                    };
                    Ext.apply(result, {
                        state: "failure",
                        errMsg: ["The data structure is not as expected"]
                    });
                }
            }

            if(failureCount) {
                rec.set("count", failureCount);
            }
            rec.set("result", result);
            rec.commit();

            ctrl.mainView.unmask();
            return result;

        },
        "columnValidation": function(rule, rec, ctrl, view, pass) {
            var result = {
                state: "success",
                errMsg: [],
                rule: rule,
                pass: pass
            };

            var validation = rule.validation;
            var targetColumn = rule.targetColumn;
            var column = ctrl.validationData.columnHeaders.byHeader[targetColumn];
            var columnData = column.data;
            var columnIndex = column.index;
            var rows = ctrl.validationData.rows;
            var row;
            var l = columnData.length;
            var x;
            var cell;
            var data;
            var passObj;
            var failureCount = 0;
            for(x = 0; x < l; x++) {

                row = rows[x];
                cell = row.col[columnIndex];
                passObj = cell.pass;
                data = cell.data;

                switch(validation.dataType) {
                    case "string":

                        break;

                    case "number":

                        break;

                    case "boolean":

                        break;

                    case "date":

                        break;
                }

                if(Ext.isBoolean(validation.isEmpty)) {
                    if(validation.isEmpty === false) {
                        if(!data || data.length == 0) {
                            if(!passObj[pass]) {
                                passObj[pass] = [];
                            }
                            if(!row.pass[pass]) {
                                row.pass[pass] = {};
                                row.pass[pass].errMsg = [];
                            }
                            passObj[pass].push("Cell is empty");
                            row.check = false;
                            row.pass[pass].check = false;
                            row.pass[pass].errMsg.push("Cell is empty");
                            failureCount++;
                        }
                    }
                }

                if(Ext.isNumber(validation.charLength)) {
                    if(validation.charLength > 0) {
                        if(data) {

                            if(data.length > validation.charLength) {
                                if(!passObj[pass]) {
                                    passObj[pass] = [];
                                }
                                if(!row.pass[pass]) {
                                    row.pass[pass] = {};
                                    row.pass[pass].errMsg = [];
                                }
                                passObj[pass].push("Cell contains too many characters.");
                                row.check = false;
                                row.pass[pass].check = false;
                                row.pass[pass].errMsg.push("Cell contains too many characters.");
                                failureCount++;
                            }

                        }
                    }
                }

                if(failureCount) {
                    Ext.apply(result, {
                        state: "failure",
                        errMsg: ["Column fails validation."]
                    });
                }
            }

            if(failureCount) {
                rec.set("count", failureCount);
            }

            rec.set("result", result);
            rec.commit();

            ctrl.mainView.unmask();
            return result;

        },
        "columnBackEndValidation": function(rule, rec, ctrl, view, pass) {
            Ext.Ajax.request({
                url: "bennie's end point",
                params: {
                    type: 'lookup',
                    rule: rule,
                    data: data
                }
            })


        }
    }

});

/*
 //dataType: “string”, “number”, “date”, “boolean” (mandatory)
 //columnFormat: “” mandatory for date and boolean, but can be optional for string and number
 //isEmpty: true/false, (mandatory)
 //length: (optional)
 //range: { start: end: } for number or date (optional)
 */