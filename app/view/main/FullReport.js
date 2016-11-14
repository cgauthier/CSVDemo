Ext.define('CSVDEMO.view.main.FullReport', {
    extend: 'Ext.panel.Panel',
    xtype: 'fullreport',
    requires: [
        "Ext.grid.Panel",
        "Ext.layout.container.Fit",
        "Ext.form.field.Radio",
        'CSVDEMO.view.main.FullReportController'
    ],
    controller: "fullreport",
    failure: null,
    fileCtrl: null,
    vGridStore: null,
    result: null,
    tabPanel: null,
    constructor: function(cfg) {
        var me = this;
        Ext.apply(me, cfg);
        me.callParent(arguments);
    },
    initComponent: function() {
        var me = this;
        var ctrl = me.getController();

        me.title = "Grid Failure Report";
        if(me.failure == "success") {
            me.title = "Grid Success Report";
        }

        me.layout = {
            type: 'fit'
        };

        me.bodyPadding = '10';

        var fields = me.generateFields();
        var data = me.generateData(fields);

        var store = Ext.create("Ext.data.Store", {
            fields: fields,
            data: data
        });
        var columns = me.generateColumns(fields);

        var config = {
            xtype: 'grid',
            store: store,
            columns: columns,
            viewConfig: {
                stripeRows: true
            }
        };

        if(me.failure == "failure") {
            config.viewConfig['getRowClass'] = function(rec, idx, rowParams, store) {
                if(rec.data.check) {
                    return "checkTrue";
                } else {
                    return "checkFalse";
                }
            };
            config.viewConfig['stripeRows'] = false;
            config['tbar'] = {
                xtype: 'toolbar',
                items: [{
                    xtype: 'radio',
                    name: me.id + "radio",
                    boxLabel: 'All',
                    inputValue: 'all',
                    checked: true
                }, {
                    xtype: 'radio',
                    name: me.id + "radio",
                    boxLabel: 'Pass',
                    inputValue: 'pass'
                }, {
                    xtype: 'radio',
                    name: me.id + "radio",
                    boxLabel: 'Fail',
                    inputValue: 'fail'
                }]
            };
        };

        me.items = [config];


        me.callParent(arguments);
    },
    generateFields: function() {
        var me = this;
        var fields = [];
        var headers = me.fileCtrl.validationData.headers;
        var l = headers.length;
        var x = 0;

        fields.push({
            name: "row",
            type: "string"
        });

        fields.push({
            name: "check",
            type: "boolean"
        });

        fields.push({
            name: "rowObj",
            type: "auto"
        });

        for(x = 0; x < l; x++) {
            fields.push({
                name: headers[x],
                type: "string"
            });
        };

        return fields;
    },
    generateData: function(fields) {
        var me = this;
        var data = [];
        var dataRow = [];
        var row = [];
        var rows = me.fileCtrl.validationData.rows;
        var l = rows.length;
        var x, y;
        var ll = fields.length;
        var temp;

        for(x = 0; x < l; x++) {
            dataRow = {};
            row = rows[x];
            dataRow["rowObj"] = Ext.clone(rows[x]);
            dataRow["row"] = x + 1;
            dataRow["check"] = row.check;
            ll = row.col.length;
            for(y = 0; y < ll; y++) {
                dataRow[fields[y + 3].name] = row.col[y].data;
            }
            data.push(dataRow)
        }
        return data;
    },
    generateColumns: function(fields) {
        var me = this;
        var columns = [];
        var baseColumnTpl = {
            flex: 1
        }
        var x, l = fields.length;
        var temp;
        for(x = 0; x < l; x++) {
            temp = Ext.clone(baseColumnTpl);

            if(fields[x].name != "rowObj") {
                Ext.apply(temp, {
                    dataIndex: fields[x].name,
                    text: fields[x].name,
                    hidden: ((me.failure == "success" && fields[x].name == "check") ? true : false )
                });

                if(fields[x].name == "row") {
                    temp.flex = null;
                    temp.width = 30;
                    temp.text = "#";
                }

                if(fields[x].name == "check") {
                    temp.flex = null;
                    temp.width = 30;
                    temp.text = "";
                    temp.renderer = function(val, meta) {
                        if(val === false){
                            meta.tdCls = "stateReportIcon failure";
                        } else {
                            meta.tdCls = "stateReportIcon success";
                        }
                    }
                }

                if(me.failure != "success") {
                    if(fields[x].name != "check" && fields[x].name != "row") {
                        temp.renderer = function(val, meta, rec, rowIdx, colIdx, store, view) {
                            return val;
                        }
                    }
                }

                columns.push(temp);
            }
        }
        return columns;
    }
});