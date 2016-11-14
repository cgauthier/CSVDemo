Ext.define('CSVDEMO.view.main.ColumnHeaderIntegrityReport', {
    extend: 'Ext.panel.Panel',
    xtype: 'columnheaderintegrityreport',
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

        me.title = me.result.rule.shortDesc + ": Failure Report";

        me.layout = {
            type: 'fit'
        };

        me.bodyPadding = '10';

        var msg = [
            me.result.errMsg[0],
            "\n\n",
            "Expected Columns: ",
            me.result.expectedHeaders.join(", "),
            "\n",
            "Actual Columns: ",
            me.result.actualHeaders.join(", "),
            "\n\n",
            "Expected Column Count: ",
            me.result.expectedCount,
            "\n",
            "Actual Column Count: ",
            me.result.actualCount
        ].join("");

        me.items = [{
            xtype: 'textarea',
            value: msg,
            readOnly: true
        }];

        me.callParent(arguments);
    }
});