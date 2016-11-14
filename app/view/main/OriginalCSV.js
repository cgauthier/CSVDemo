Ext.define('CSVDEMO.view.main.OriginalCSV', {
    extend: 'Ext.panel.Panel',
    xtype: 'origincsv',
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

        me.title = "Original CSV";

        me.layout = {
            type: 'fit'
        };

        me.bodyPadding = '10';

        me.items = [{
            xtype: 'textarea',
            value: me.fileCtrl.allData.oData,
            readOnly: true
        }];

        me.callParent(arguments);
    }
});