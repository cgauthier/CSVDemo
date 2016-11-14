Ext.define('CSVDEMO.view.main.JSONOutput', {
    extend: 'Ext.panel.Panel',
    xtype: 'jsonoutput',
    requires: [
        "Ext.form.field.TextArea",
        "Ext.layout.container.Fit"
    ],
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

        me.title = "JSON Output";

        me.layout = {
            type: 'fit'
        };

        me.bodyPadding = '10';
        var jsonData = me.generateData();
        var prettyJSON = JSON.stringify(jsonData, null, "\t");

        me.items = [{
            xtype: 'textarea',
            value: prettyJSON,
            readOnly: true
        }];

        me.callParent(arguments);
    },
    generateData: function() {
        var me = this;
        var JSON = {
            success: true,
            errMsg: [],
            data: []
        };
        var dataRow = {};
        var row;
        var rows = me.fileCtrl.validationData.rows;
        var headers = me.fileCtrl.validationData.headers;
        var l = rows.length;
        var x, y;
        var ll = headers.length;
        var cellData;
        var header;

        for(x = 0; x < l; x++) {
            row = rows[x];
            dataRow = {};
            for(y = 0; y < ll; y++) {
                header=headers[y];
                cellData = row.col[y].data;
                dataRow[header] = cellData;
            }
            JSON.data.push(dataRow);
        }

        return JSON;
    }
});