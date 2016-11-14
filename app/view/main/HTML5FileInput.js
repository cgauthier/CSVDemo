Ext.define('CSVDEMO.view.main.HTML5FileInput', {
    extend: 'Ext.panel.Panel',
    xtype: 'html5fileinput',
    requires: [],
    uses: [
        "Ext.window.MessageBox"
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
        var id = me.getId() + "_fileinput";
        var inputTpl = '<input type="file" style="margin:0px;padding:0px;" id="{0}"></input>'
        me.html = Ext.String.format(inputTpl, id);
        me.listeners = {
            resize: {
                fn: function(cmp, width, height) {
                    var inputFileEl = Ext.get(cmp.getEl().select("input[type='file']").elements[0]);
                    inputFileEl.setWidth(width);
                }
            },
            afterrender: {
                fn: function(cmp) {
                    var inputFileEl = Ext.get(cmp.getEl().select("input[type='file']").elements[0]);

                    inputFileEl.on('change', function(e, el) {
                        var fReader;
                        if(window.File && window.FileReader && window.FileList && window.Blob) {
                            fReader = new FileReader();
                            fReader.readAsText(el.files[0]);
                            fReader.onloadend = function(e) {
                                var textContent = e.target.result;
                               // debugger;
                            }
                        } else {
                            Ext.Msg.alert("Warning", "This browser doesn't support the HTML5 File API.");
                        }
                    }, cmp);
                }
            }
        }
        me.callParent(arguments);
    }
})