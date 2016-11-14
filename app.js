Ext.application({
    name: 'CSVDEMO',
    extend: 'CSVDEMO.Application',
    requires: [
        'CSVDEMO.util.PUBSUB',
        'CSVDEMO.view.main.Main'
    ],
    mainView: 'CSVDEMO.view.main.Main'
});
