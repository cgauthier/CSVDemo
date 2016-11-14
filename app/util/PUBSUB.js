/*
 * Written by: Claude Gauthier
 * Date: 02/08/2013
 * Email: claude_r_gauthier@hotmail.com
 *
 */
Ext.define('CSVDEMO.util.PUBSUB', {
    singleton: true,
    alternateClassName: 'PUBSUB',
    constructor: function(config) {
        this.initConfig(config);
        this.callParent(arguments);
    },
    queue: {},
    execBatchArr: [],
    pub: function(channel, data) {
        if(this.queue[channel]) {
            var obj;
            var funcChain = [];
            for(origin in this.queue[channel]) {
                obj = this.queue[channel][origin];
                funcChain.push(Ext.Function.pass(obj.callback, [data], obj.scope));
            }
            this.execBatchArr.push(funcChain);
            if(this.execBatchArr.length == 1) {
                this.execBatch();
            }
        }
    },
    sub: function(channel, origin, callback, scope) {
        if(!this.queue[channel]) {
            this.queue[channel] = {};
        }
        this.queue[channel][origin] = {};
        this.queue[channel][origin].callback = callback;
        this.queue[channel][origin].scope = scope;
    },
    unsub: function(channel, origin) {
        delete this.queue[channel][origin];
    },
    execFuncChain: function(funcArr, idx) {
        var scope = this;
        if(idx >= 0) {
            window.setTimeout(function() {
                funcArr[idx]();
                scope.execFuncChain(funcArr, idx - 1);
            }, 0);
        }
        else {
            scope.execBatchArr.shift();
            scope.execBatch(); // complete the circle as execBatch will terminate when the execBatchArr array is empty
        }
    },
    execBatch: function() {
        var scope = this;
        if(scope.execBatchArr.length > 0) {
            window.setTimeout(function() {
                scope.execFuncChain(scope.execBatchArr[0], scope.execBatchArr[0].length -1);
            }, 50); // this value needs to be tested further, 0 would be ideal.
        }
    }
});
