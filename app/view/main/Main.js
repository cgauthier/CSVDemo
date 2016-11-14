/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('CSVDEMO.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.layout.container.Border',
        'CSVDEMO.view.main.Header',
        'CSVDEMO.view.main.File',
        'CSVDEMO.view.main.Content'
    ],

    //controller: 'main',
    //viewModel: 'main',

    constructor: function(cfg) {
        var me = this;
        Ext.apply(me, cfg);
        me.callParent(arguments);
    },
    initComponent: function() {
        var me = this;

        me.layout = {
            type: 'border'
        };

        me.title = "CSV Validator";

        me.items = [{
            xtype: 'filepanel',
            region: 'west',
            width: 400,
            collapsible: true,
            resizable: true,
            title: "Select a File",
            // title: "Select a Template",
            border: true,
            style: {
                "border-right": "1px solid #DAD6EB"
            }
        }, {
            xtype: 'contentpanel',
            region: 'center',
            title: "Result"
        }];


        me.callParent(arguments);
    }

});
