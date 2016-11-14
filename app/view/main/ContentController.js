Ext.define('CSVDEMO.view.main.ContentController', {
    extend: 'Ext.app.ViewController',
    alias: "controller.content",
    uses: [
        "CSVDEMO.view.main.ColumnHeaderIntegrityReport",
        'CSVDEMO.view.main.DataStructureIntegrityReport',
        'CSVDEMO.view.main.OriginalCSV',
        'CSVDEMO.view.main.FullReport',
        'CSVDEMO.view.main.JSONOutput'
    ],
    init: function(view) {
        var ctrl = this;
        ctrl.control({

        })
    },
    resetContent: function(data) {
        var me = this;
        me.removeAll();
    },
    setFullReport: function(data) {
        var me = this;
        var failure = data.data.failure;
        var fileCtrl = data.data.fileCtrl;
        var vGridStore = data.data.vGridStore;
        var result = data.data.result;

        var panel = Ext.create("CSVDEMO.view.main.FullReport", {
            failure: failure,
            fileCtrl: fileCtrl,
            vGridStore: vGridStore,
            result: result,
            tabPanel: me
        });

        me.add(panel);
        me.setActiveTab(0);

    },
    setJSONOutput: function(data) {
        var me = this;
        var failure = data.data.failure;
        var fileCtrl = data.data.fileCtrl;
        var vGridStore = data.data.vGridStore;
        var result = data.data.result;

        var panel = Ext.create("CSVDEMO.view.main.JSONOutput", {
            failure: failure,
            fileCtrl: fileCtrl,
            vGridStore: vGridStore,
            result: result,
            tabPanel: me
        });

        me.add(panel);
        me.setActiveTab(0);

    },
    setDataStructureIntegrityReport: function(data) {
        var me = this;
        var failure = data.data.failure;
        var fileCtrl = data.data.fileCtrl;
        var vGridStore = data.data.vGridStore;
        var result = data.data.result;

        var panel = Ext.create("CSVDEMO.view.main.DataStructureIntegrityReport", {
            failure: failure,
            fileCtrl: fileCtrl,
            vGridStore: vGridStore,
            result: result,
            tabPanel: me
        });

        me.add(panel);
        me.setActiveTab(0);

    },
    setColumnHeaderIntegrityReport: function(data) {
        var me = this;

        var failure = data.data.failure;
        var fileCtrl = data.data.fileCtrl;
        var vGridStore = data.data.vGridStore;
        var result = data.data.result;

        var panel = Ext.create("CSVDEMO.view.main.ColumnHeaderIntegrityReport", {
            failure: failure,
            fileCtrl: fileCtrl,
            vGridStore: vGridStore,
            result: result,
            tabPanel: me
        });

        me.add(panel);
        me.setActiveTab(0);
    },
    setOriginalCSV: function(data) {
        var me = this;

        var fileCtrl = data.data.fileCtrl;
        var vGridStore = data.data.vGridStore;
        var result = data.data.result;

        var panel = Ext.create("CSVDEMO.view.main.OriginalCSV", {
            fileCtrl: fileCtrl,
            vGridStore: vGridStore,
            result: result,
            tabPanel: me
        });

        me.add(panel);
        me.setActiveTab(0);
    }
})