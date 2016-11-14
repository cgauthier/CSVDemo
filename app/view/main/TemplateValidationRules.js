Ext.define('CSVDEMO.view.main.TemplateValidationRules', {
    extend: 'Ext.grid.Panel',
    xtype: 'templatevalidationrulespanel',
    requires: [
        'Ext.data.Store'
    ],
    constructor: function(cfg) {
        var me = this;
        Ext.apply(me, cfg);
        me.callParent(arguments);
    },
    initComponent: function() {
        var me = this;

        var store = Ext.create('Ext.data.Store', {
            fields: [
                { name: "pass", type: 'number'},
                { name: "desc", type: 'string'},
                { name: "state", type: 'string'},
                { name: "count", type: 'string'},
                { name: "ruleObj", type: 'auto'},
                { name: "result", type: 'auto'}
            ],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: ''
                }
            }
        });

        me.store = store;
        me.forceFit = true;

        me.viewConfig = {
            stripeRows: false
        };

        // state: pending, in progress, success, failure

        me.columns = [{
            text: "#",
            dataIndex: "pass",
            width: 30
        }, {
            text: "Description",
            dataIndex: "desc",
            flex: 1
        }, {
            text: "State",
            dataIndex: "state",
            width: 100,
            align: 'center',
            renderer: function(val, meta, rec, rowIdx, colIdx, store, view) {
                meta.tdCls = "validationIcon " + val.toLowerCase().replace(/ /g, '');
                return val;
            }
        }, {
            text: "Count",
            dataIndex: "count",
            width: 60,
            align: 'center'
        }];

        me.callParent(arguments);
    }
});