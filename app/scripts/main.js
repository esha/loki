(function($, $doc, window, trigger) {
    'use strict';
    var _ = window.app = {
        debug: window.DEBUG || /debug/.test(window.location+''),
        dom: ['product','endpoints','label','statement'],
        url: {
            root: '/fake',
            statement: '/{id}',
            label: '/label/{id}'
        },
        products: [
            { name:'Product Name', id:'product-id-of-some-sort' }
        ],
        fillURL: function(url, id) {
            return _.url.root + url.replace(/{id}/, id);
        },
        endpoints: function() {
            var id = dom.product.val();
            return !id || {
                label: _.fillURL(url.label, id),
                statement: _.fillURL(url.statement, id)
            };
        },
        events: {
            update: function() {
                var endpoints = _.endpoints();
                dom.endpoints.html(endpoints.statement + '<br>' + endpoints.label);
            },
            show: function() {
                var endpoints = _.endpoints();
                dom.label.attr('src', endpoints.label);
                dom.statement.text('Loading...');
                var ajax = $.getJSON(endpoints.statement);
                ajax.done(function(data) {
                    dom.statement.text(data.statement);
                });
            }
        },
        trace: function(fn, key) {
            return function() {
                console.log('Entering '+(key||fn.name), arguments.length ? arguments : '');
                var ret = fn.apply(this, arguments);
                console.log('Exiting '+(key||fn.name), ret === undefined ? '' : ret);
                return ret;
            };
        },
        init: function(_) {
            // infrastructure
            _.dom.forEach(function(name) {
                dom[name] = $('[id="'+name+'"]');
            });
            Object.keys(_.events).forEach(function(key) {
                var fn = _.events[key];
                $doc.on(key, _.debug ? fn : _.trace(fn, key));
            });
            // interface
            _.products.forEach(function(product) {
                var option = '<option value="'+product.id+'">'+product.name+'</option>';
                dom.product.append(option);
            });
            trigger('update show');
        }
    },
    dom = _.dom,
    url = _.url;
    _.init(_);

})(jQuery, jQuery(document), window, trigger);
