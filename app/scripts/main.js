(function(document, Eventi, ajax, store) {
    'use strict';
    var _ = window.app = {
        dom: 'api json product label ingredients allergens'.split(' '),
        products: [
            { name:'Product Name', id:'product-id-of-some-sort' }
        ],
        base: '/fake',
        paths: {
            food: '/{id}',
            label: '/label/{id}'
        },
        path: function(path, id) {
            path = _.base + (_.paths[path] || path);
            return id ? path.replace(/{id}/, id) : path;
        },
        param: function(url, key, val) {
            return !val && val !== 0 && val !== false ? url :
                url + (url.indexOf('?')>0 ? '&':'?') + key + '=' + val;
        },
        ajax: function(url, data, opts) {
            if (data && !(opts && opts.method === 'POST')) {
                for (var key in data) {
                    url = _.param(url, key, data[key]);
                }
                data = null;
            }
            if (!opts) {
                opts = { method: 'GET' };
            }
            opts.url = url;
            opts.data = data;
            opts.dataType = 'json';

            dom.api.values({
                url: opts.url.replace(_.base, ''),
                method: opts.method
            });
            dom.api.classList.remove('hidden');
            return ajax(opts).then(function(response) {
                store('json', response);
                return response;
            });
        },
        events: {
            'location@#json': function() {
                var json = store('json');
                dom.json.innerHTML = json ? JSON.stringify(json, null, 2) : '';
            },
            show: function() {
                var id = dom.product.value;
                dom.label.setAttribute('src', _.path('label', id));
                dom.ingredients.innerText = 'Loading...';
                _.ajax(_.path('food', id)).done(function(data) {
                    dom.ingredients.innerText = data.IngredientStatementInfo.AlternateText;
                    var allergens = '';
                    data.Recipe.AllergenStatements.forEach(function(allergen) {
                        allergen.AlternateText.forEach(function(alt) {
                            allergens += alt.valueField + ' ';
                        });
                    });
                    dom.allergens.innerText = allergens;
                });
            }
        },
        init: function() {
            // infrastructure
            dom.forEach(function(name) {
                dom[name] = document.getElementById(name);
            });
            Eventi.on(window, _.events);
            // interface
            _.products.forEach(function(product) {
                var option = '<option value="'+product.id+'">'+product.name+'</option>';
                dom.product.insertAdjacentHTML('beforeend', option);
            });
            Eventi.fire('update show');
        }
    },
    dom = _.dom;
    _.init();

})(document, window.Eventi, jQuery.ajax, window.store);