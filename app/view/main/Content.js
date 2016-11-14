Ext.define('CSVDEMO.view.main.Content', {
    extend: 'Ext.tab.Panel',
    xtype: 'contentpanel',
    requires: [
        'CSVDEMO.view.main.ContentController'
    ],
    controller: 'content',
    constructor: function(cfg) {
        var me = this;
        Ext.apply(me, cfg);
        me.callParent(arguments);
    },
    initComponent: function() {
        var me = this;
        var ctrl = me.getController();
        PUBSUB.sub("resetContent", "resetContent", ctrl.resetContent, me);
        PUBSUB.sub("setFullReport", "setFullReport", ctrl.setFullReport, me);
        PUBSUB.sub("setDataStructureIntegrityReport", "setDataStructureIntegrityReport", ctrl.setDataStructureIntegrityReport, me);
        PUBSUB.sub("setColumnHeaderIntegrityReport", "setColumnHeaderIntegrityReport", ctrl.setColumnHeaderIntegrityReport, me);
        PUBSUB.sub("setOriginalCSV", "setOriginalCSV", ctrl.setOriginalCSV, me);
        PUBSUB.sub("setJSONOutput", "setJSONOutput", ctrl.setJSONOutput, me);
        me.items = [];

        // should enable/disable button based on type of report (success or failure)
        me.bbar = {
            xtype: 'toolbar',
            items: ["->", {
                xtype: 'button',
                text: 'Generate'
            }]
        };

        me.callParent(arguments);
    }
});