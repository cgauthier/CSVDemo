Ext.define('CSVDEMO.view.main.DataStructureIntegrityReportController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.datastructureintegrityreport',
    requires: [],
    init: function(view) {
        var ctrl = this;
        ctrl.control({
            "datastructureintegrityreport radio": {
                "change": {
                    fn: function(radio, newV, oldV) {
                        var me = this;
                        var gridStore;

                        if(newV == true) {

                            gridStore = me.down('grid').getStore();
                            gridStore.clearFilter();

                            switch(radio.inputValue) {
                                case "pass":
                                    gridStore.setFilters({
                                        property: "check",
                                        value: true
                                    });
                                break;

                                case "fail":
                                    gridStore.setFilters({
                                        property: "check",
                                        value: false
                                    });
                                break;
                            }
                        }
                    },
                    scope: view
                }
            }
        });
    }

});