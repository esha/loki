(function($, $doc, window, trigger) {
    'use strict';
    var _ = window.app = {
        debug: window.DEBUG || /debug/.test(window.location+''),
        dom: ['product','endpoints','label','ingredients','allergens'],
        url: {
            root: '/fake',
            food: '/{id}',
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
                food: _.fillURL(url.food, id)
            };
        },
        events: {
            update: function() {
                var endpoints = _.endpoints();
                dom.endpoints.html(endpoints.food + '<br>' + endpoints.label);
            },
            show: function() {
                var endpoints = _.endpoints();
                dom.label.attr('src', endpoints.label);
                dom.ingredients.text('Loading...');
                var ajax = $.getJSON(endpoints.food);
                ajax.done(function(data) {
                    dom.ingredients.text(data.IngredientStatementInfo.AlternateText);
                    var allergens = '';
                    data.Recipe.AllergenStatements.forEach(function(allergen) {
                        allergen.AlternateText.forEach(function(alt) {
                            allergens += alt.valueField + ' ';
                        });
                    });
                    dom.allergens.text(allergens);
                });
            }
        },
        trace: function(o, k) {
            if ($.isPlainObject(o)) {
                Object.keys(o).forEach(function(key) {
                    if (k && key === k) {
                        o[key] = _.trace(o[key], key);
                    }
                });
                return o;
            }
            if ($.isFunction(o)) {
                return function() {
                    console.log('Entering '+(k||o.name), arguments.length ? arguments : '');
                    var ret = o.apply(this, arguments);
                    console.log('Exiting '+(k||o.name), ret === undefined ? '' : ret);
                    return ret;
                };
            }
            return o;
        },
        init: function(_) {
            // infrastructure
            if (_.debug){ _.trace(_); }
            _.dom.forEach(function(name) {
                dom[name] = $('[id="'+name+'"]');
            });
            Object.keys(_.events).forEach(function(key) {
                $doc.on(key, _.events[key]);
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
