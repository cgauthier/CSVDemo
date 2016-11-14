Ext.define('CSVDEMO.view.main.File', {
    extend: 'Ext.panel.Panel',
    xtype: 'filepanel',
    requires: [
        'Ext.layout.container.VBox',
        'CSVDEMO.view.main.TemplateValidationRules',
        'CSVDEMO.view.main.FileController',
        'Ext.data.Store',
        'Ext.panel.Panel',
        'Ext.container.Container',
        'Ext.form.field.ComboBox',
        'CSVDEMO.view.main.FileControl'
     //   'CSVDEMO.view.main.HTML5FileInput'
    ],
    controller: "file",
    vTpl: null,
    dataContent: null,
    constructor: function(cfg) {
        var me = this;
        Ext.apply(me, cfg);
        me.callParent(arguments);
    },
    initComponent: function() {
        var me = this;

        me.layout = {
            type: 'vbox',
            align: 'stretch'
        };

        var typeStore = Ext.create('Ext.data.Store', {
            fields: ["file", "label"],
            proxy: {
                type: "memory",
                reader: {
                    type: "json",
                    rootProperty: ""
                }
            }
        });

        var vendorStore = Ext.create('Ext.data.Store', {
            fields: ["key", "label"],
            proxy: {
                type: "memory",
                reader: {
                    type: "json",
                    rootProperty: ""
                }
            }
        });

        me.items = [{
            xtype: 'container',
            hidden: true,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            defaults: {
                margin: "2"
            },
            items: [{
                xtype: 'combo',
                queryMode: 'local',
                displayField: "label",
                valueField: "key",
                fieldLabel: "Vendor",
                emptyText: "Choose a Vendor",
                store: vendorStore,
                itemId: "vendorCombo"
            }, {
                xtype: 'combo',
                queryMode: 'local',
                displayField: "label",
                valueField: "key",
                fieldLabel: "Type",
                emptyText: "Choose a Type",
                store: typeStore,
                itemId: "typeCombo"
            }]
        },
        //{
        //    xtype: 'html5fileinput',
        //    title: "Select a File",
        //    hidden: true
        //},
        {
            xtype: 'filecontrolform'
           // title: "Select a File"
        }, {
            flex: 1,
            xtype: "templatevalidationrulespanel",
            title: "Template Validation Rules"
        }];




        me.callParent(arguments);
    }
});