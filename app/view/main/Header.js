Ext.define('CSVDEMO.view.main.Header', {
    extend: 'Ext.panel.Panel',
    xtype: 'headerpanel',
    requires: [],
    constructor: function(cfg) {
        var me = this;
        Ext.apply(me, cfg);
        me.callParent(arguments);
    },
    initComponent: function() {
        var me = this;


        me.callParent(arguments);
    }
})