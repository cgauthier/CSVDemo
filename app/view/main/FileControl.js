Ext.define('CSVDEMO.view.main.FileControl', {
    extend: 'Ext.form.Panel',
    xtype: 'filecontrolform',
    requires: [
        "Ext.form.field.File",
        "Ext.layout.container.HBox"
    ],
    constructor: function(cfg) {
        var me = this;
        Ext.apply(me, cfg);
        me.callParent(arguments);
    },
    initComponent: function() {
        var me = this;

        me.margin = "0";
        me.padding = "2";

        me.layout = {
            type: 'hbox',
            align: 'stretch'
        };

        me.items = [{
            xtype: 'filefield',
            flex: 1
        }, {
            xtype: 'button',
            action: 'clear',
            width: '30',
            text: "Reset",
            margin: "0 0 0 2"
        }];

        me.callParent(arguments);
    }
})