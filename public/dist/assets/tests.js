define('apem/tests/adapters/application.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - adapters/application.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'adapters/application.js should pass jshint.');
    });
});
define('apem/tests/app.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - app.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'app.js should pass jshint.');
    });
});
define('apem/tests/helpers/currency-format.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - helpers/currency-format.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'helpers/currency-format.js should pass jshint.');
    });
});
define('apem/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = destroyApp;

    function destroyApp(application) {
        _ember['default'].run(application, 'destroy');
    }
});
define('apem/tests/helpers/destroy-app.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - helpers/destroy-app.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'helpers/destroy-app.js should pass jshint.');
    });
});
define('apem/tests/helpers/ember-basic-dropdown', ['exports', 'ember', 'ember-runloop'], function (exports, _ember, _emberRunloop) {
    exports.nativeClick = nativeClick;
    exports.clickTrigger = clickTrigger;
    exports.tapTrigger = tapTrigger;
    exports.fireKeydown = fireKeydown;

    // integration helpers
    function focus(el) {
        if (!el) {
            return;
        }
        var $el = jQuery(el);
        if ($el.is(':input, [contenteditable=true]')) {
            var type = $el.prop('type');
            if (type !== 'checkbox' && type !== 'radio' && type !== 'hidden') {
                (0, _emberRunloop['default'])(null, function () {
                    // Firefox does not trigger the `focusin` event if the window
                    // does not have focus. If the document doesn't have focus just
                    // use trigger('focusin') instead.

                    if (!document.hasFocus || document.hasFocus()) {
                        el.focus();
                    } else {
                        $el.trigger('focusin');
                    }
                });
            }
        }
    }

    function nativeClick(selector) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var mousedown = new window.Event('mousedown', {bubbles: true, cancelable: true, view: window});
        var mouseup = new window.Event('mouseup', {bubbles: true, cancelable: true, view: window});
        var click = new window.Event('click', {bubbles: true, cancelable: true, view: window});
        Object.keys(options).forEach(function (key) {
            mousedown[key] = options[key];
            mouseup[key] = options[key];
            click[key] = options[key];
        });
        var element = document.querySelector(selector);
        (0, _emberRunloop['default'])(function () {
            return element.dispatchEvent(mousedown);
        });
        focus(element);
        (0, _emberRunloop['default'])(function () {
            return element.dispatchEvent(mouseup);
        });
        (0, _emberRunloop['default'])(function () {
            return element.dispatchEvent(click);
        });
    }

    function clickTrigger(scope) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var selector = '.ember-basic-dropdown-trigger';
        if (scope) {
            selector = scope + ' ' + selector;
        }
        nativeClick(selector, options);
    }

    function tapTrigger(scope) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var selector = '.ember-basic-dropdown-trigger';
        if (scope) {
            selector = scope + ' ' + selector;
        }
        var touchStartEvent = new window.Event('touchstart', {bubbles: true, cancelable: true, view: window});
        Object.keys(options).forEach(function (key) {
            return touchStartEvent[key] = options[key];
        });
        (0, _emberRunloop['default'])(function () {
            return document.querySelector(selector).dispatchEvent(touchStartEvent);
        });
        var touchEndEvent = new window.Event('touchend', {bubbles: true, cancelable: true, view: window});
        Object.keys(options).forEach(function (key) {
            return touchEndEvent[key] = options[key];
        });
        (0, _emberRunloop['default'])(function () {
            return document.querySelector(selector).dispatchEvent(touchEndEvent);
        });
    }

    function fireKeydown(selector, k) {
        var oEvent = document.createEvent('Events');
        oEvent.initEvent('keydown', true, true);
        $.extend(oEvent, {
            view: window,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: k,
            charCode: k
        });
        (0, _emberRunloop['default'])(function () {
            return document.querySelector(selector).dispatchEvent(oEvent);
        });
    }

    // acceptance helpers

    exports['default'] = function () {
        _ember['default'].Test.registerAsyncHelper('clickDropdown', function (app, cssPath) {
            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            clickTrigger(cssPath, options);
        });

        _ember['default'].Test.registerAsyncHelper('tapDropdown', function (app, cssPath) {
            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            tapTrigger(cssPath, options);
        });
    };
});
define('apem/tests/helpers/ember-power-select', ['exports', 'jquery', 'ember-runloop', 'ember-test'], function (exports, _jquery, _emberRunloop, _emberTest) {
    exports.nativeMouseDown = nativeMouseDown;
    exports.nativeMouseUp = nativeMouseUp;
    exports.triggerKeydown = triggerKeydown;
    exports.typeInSearch = typeInSearch;
    exports.clickTrigger = clickTrigger;
    exports.nativeTouch = nativeTouch;
    exports.touchTrigger = touchTrigger;

    // Helpers for integration tests

    function typeText(selector, text) {
        var $selector = (0, _jquery['default'])((0, _jquery['default'])(selector).get(0)); // Only interact with the first result
        $selector.val(text);
        var event = document.createEvent('Events');
        event.initEvent('input', true, true);
        $selector[0].dispatchEvent(event);
    }

    function fireNativeMouseEvent(eventType, selectorOrDomElement) {
        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        var event = new window.Event(eventType, {bubbles: true, cancelable: true, view: window});
        Object.keys(options).forEach(function (key) {
            return event[key] = options[key];
        });
        var target = undefined;
        if (typeof selectorOrDomElement === 'string') {
            target = (0, _jquery['default'])(selectorOrDomElement)[0];
        } else {
            target = selectorOrDomElement;
        }
        (0, _emberRunloop['default'])(function () {
            return target.dispatchEvent(event);
        });
    }

    function nativeMouseDown(selectorOrDomElement, options) {
        fireNativeMouseEvent('mousedown', selectorOrDomElement, options);
    }

    function nativeMouseUp(selectorOrDomElement, options) {
        fireNativeMouseEvent('mouseup', selectorOrDomElement, options);
    }

    function triggerKeydown(domElement, k) {
        var oEvent = document.createEvent('Events');
        oEvent.initEvent('keydown', true, true);
        _jquery['default'].extend(oEvent, {
            view: window,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: k,
            charCode: k
        });
        (0, _emberRunloop['default'])(function () {
            domElement.dispatchEvent(oEvent);
        });
    }

    function typeInSearch(text) {
        (0, _emberRunloop['default'])(function () {
            typeText('.ember-power-select-search-input, .ember-power-select-search input, .ember-power-select-trigger-multiple-input, input[type="search"]', text);
        });
    }

    function clickTrigger(scope) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var selector = '.ember-power-select-trigger';
        if (scope) {
            selector = scope + ' ' + selector;
        }
        nativeMouseDown(selector, options);
    }

    function nativeTouch(selectorOrDomElement) {
        var event = new window.Event('touchstart', {bubbles: true, cancelable: true, view: window});
        var target = undefined;

        if (typeof selectorOrDomElement === 'string') {
            target = (0, _jquery['default'])(selectorOrDomElement)[0];
        } else {
            target = selectorOrDomElement;
        }
        (0, _emberRunloop['default'])(function () {
            return target.dispatchEvent(event);
        });
        (0, _emberRunloop['default'])(function () {
            event = new window.Event('touchend', {bubbles: true, cancelable: true, view: window});
            target.dispatchEvent(event);
        });
    }

    function touchTrigger() {
        var selector = '.ember-power-select-trigger';
        nativeTouch(selector);
    }

    // Helpers for acceptance tests

    exports['default'] = function () {
        _emberTest['default'].registerAsyncHelper('selectChoose', function (app, cssPath, value) {
            var $trigger = find(cssPath).find('.ember-power-select-trigger');
            var contentId = '' + $trigger.attr('aria-controls');
            var $content = find('#' + contentId);
            // If the dropdown is closed, open it
            if ($content.length === 0) {
                nativeMouseDown(cssPath + ' .ember-power-select-trigger');
                wait();
            }

            // Select the option with the given text
            andThen(function () {
                var potentialTargets = (0, _jquery['default'])('#' + contentId + ' .ember-power-select-option:contains("' + value + '")').toArray();
                var target = undefined;
                if (potentialTargets.length > 1) {
                    target = potentialTargets.filter(function (t) {
                            return t.textContent.trim() === value;
                        })[0] || potentialTargets[0];
                } else {
                    target = potentialTargets[0];
                }
                nativeMouseUp(target);
            });
        });

        _emberTest['default'].registerAsyncHelper('selectSearch', function (app, cssPath, value) {
            var $trigger = find(cssPath).find('.ember-power-select-trigger');
            var contentId = '' + $trigger.attr('aria-controls');
            var isMultipleSelect = (0, _jquery['default'])(cssPath + ' .ember-power-select-trigger-multiple-input').length > 0;

            var dropdownIsClosed = (0, _jquery['default'])('#' + contentId).length === 0;
            if (dropdownIsClosed) {
                nativeMouseDown(cssPath + ' .ember-power-select-trigger');
                wait();
            }
            var isDefaultSingleSelect = (0, _jquery['default'])('.ember-power-select-search-input').length > 0;

            if (isMultipleSelect) {
                fillIn(cssPath + ' .ember-power-select-trigger-multiple-input', value);
            } else if (isDefaultSingleSelect) {
                fillIn('.ember-power-select-search-input', value);
            } else {
                // It's probably a customized version
                var inputIsInTrigger = !!find(cssPath + ' .ember-power-select-trigger input[type=search]')[0];
                if (inputIsInTrigger) {
                    fillIn(cssPath + ' .ember-power-select-trigger input[type=search]', value);
                } else {
                    fillIn('#' + contentId + ' .ember-power-select-search-input[type=search]', 'input');
                }
            }
        });

        _emberTest['default'].registerAsyncHelper('removeMultipleOption', function (app, cssPath, value) {
            var elem = find(cssPath + ' .ember-power-select-multiple-options > li:contains(' + value + ') > .ember-power-select-multiple-remove-btn').get(0);
            try {
                nativeMouseDown(elem);
                wait();
            } catch (e) {
                console.warn('css path to remove btn not found');
                throw e;
            }
        });

        _emberTest['default'].registerAsyncHelper('clearSelected', function (app, cssPath) {
            var elem = find(cssPath + ' .ember-power-select-clear-btn').get(0);
            try {
                nativeMouseDown(elem);
                wait();
            } catch (e) {
                console.warn('css path to clear btn not found');
                throw e;
            }
        });
    };
});
define('apem/tests/helpers/is-equal.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - helpers/is-equal.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'helpers/is-equal.js should pass jshint.');
    });
});
define('apem/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'apem/tests/helpers/start-app', 'apem/tests/helpers/destroy-app'], function (exports, _qunit, _apemTestsHelpersStartApp, _apemTestsHelpersDestroyApp) {
    exports['default'] = function (name) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        (0, _qunit.module)(name, {
            beforeEach: function beforeEach() {
                this.application = (0, _apemTestsHelpersStartApp['default'])();

                if (options.beforeEach) {
                    options.beforeEach.apply(this, arguments);
                }
            },

            afterEach: function afterEach() {
                if (options.afterEach) {
                    options.afterEach.apply(this, arguments);
                }

                (0, _apemTestsHelpersDestroyApp['default'])(this.application);
            }
        });
    };
});
define('apem/tests/helpers/module-for-acceptance.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - helpers/module-for-acceptance.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'helpers/module-for-acceptance.js should pass jshint.');
    });
});
define('apem/tests/helpers/resolver', ['exports', 'apem/resolver', 'apem/config/environment'], function (exports, _apemResolver, _apemConfigEnvironment) {

    var resolver = _apemResolver['default'].create();

    resolver.namespace = {
        modulePrefix: _apemConfigEnvironment['default'].modulePrefix,
        podModulePrefix: _apemConfigEnvironment['default'].podModulePrefix
    };

    exports['default'] = resolver;
});
define('apem/tests/helpers/resolver.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - helpers/resolver.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'helpers/resolver.js should pass jshint.');
    });
});
define('apem/tests/helpers/start-app', ['exports', 'ember', 'apem/app', 'apem/config/environment'], function (exports, _ember, _apemApp, _apemConfigEnvironment) {
    exports['default'] = startApp;

    function startApp(attrs) {
        var application = undefined;

        var attributes = _ember['default'].merge({}, _apemConfigEnvironment['default'].APP);
        attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

        _ember['default'].run(function () {
            application = _apemApp['default'].create(attributes);
            application.setupForTesting();
            application.injectTestHelpers();
        });

        return application;
    }
});
define('apem/tests/helpers/start-app.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - helpers/start-app.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'helpers/start-app.js should pass jshint.');
    });
});
define('apem/tests/initializers/services.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - initializers/services.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'initializers/services.js should pass jshint.');
    });
});
define('apem/tests/integration/components/side-nav-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

    (0, _emberQunit.moduleForComponent)('side-nav', 'Integration | Component | side nav', {
        integration: true
    });

    (0, _emberQunit.test)('it renders', function (assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.on('myAction', function(val) { ... });

        this.render(Ember.HTMLBars.template((function () {
            return {
                meta: {
                    'fragmentReason': {
                        'name': 'missing-wrapper',
                        'problems': ['wrong-type']
                    },
                    'revision': 'Ember@2.4.6',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 1,
                            'column': 12
                        }
                    }
                },
                isEmpty: false,
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createComment('');
                    dom.appendChild(el0, el1);
                    return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                    var morphs = new Array(1);
                    morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
                    dom.insertBoundary(fragment, 0);
                    dom.insertBoundary(fragment, null);
                    return morphs;
                },
                statements: [['content', 'side-nav', ['loc', [null, [1, 0], [1, 12]]]]],
                locals: [],
                templates: []
            };
        })()));

        assert.equal(this.$().text().trim(), '');

        // Template block usage:
        this.render(Ember.HTMLBars.template((function () {
            var child0 = (function () {
                return {
                    meta: {
                        'fragmentReason': false,
                        'revision': 'Ember@2.4.6',
                        'loc': {
                            'source': null,
                            'start': {
                                'line': 2,
                                'column': 4
                            },
                            'end': {
                                'line': 4,
                                'column': 4
                            }
                        }
                    },
                    isEmpty: false,
                    arity: 0,
                    cachedFragment: null,
                    hasRendered: false,
                    buildFragment: function buildFragment(dom) {
                        var el0 = dom.createDocumentFragment();
                        var el1 = dom.createTextNode('      template block text\n');
                        dom.appendChild(el0, el1);
                        return el0;
                    },
                    buildRenderNodes: function buildRenderNodes() {
                        return [];
                    },
                    statements: [],
                    locals: [],
                    templates: []
                };
            })();

            return {
                meta: {
                    'fragmentReason': {
                        'name': 'missing-wrapper',
                        'problems': ['wrong-type']
                    },
                    'revision': 'Ember@2.4.6',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 5,
                            'column': 2
                        }
                    }
                },
                isEmpty: false,
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createTextNode('\n');
                    dom.appendChild(el0, el1);
                    var el1 = dom.createComment('');
                    dom.appendChild(el0, el1);
                    var el1 = dom.createTextNode('  ');
                    dom.appendChild(el0, el1);
                    return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                    var morphs = new Array(1);
                    morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
                    return morphs;
                },
                statements: [['block', 'side-nav', [], [], 0, null, ['loc', [null, [2, 4], [4, 17]]]]],
                locals: [],
                templates: [child0]
            };
        })()));

        assert.equal(this.$().text().trim(), 'template block text');
    });
});
define('apem/tests/integration/components/side-nav-test.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - integration/components/side-nav-test.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'integration/components/side-nav-test.js should pass jshint.');
    });
});
define('apem/tests/integration/components/users-grid-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

    (0, _emberQunit.moduleForComponent)('users-grid', 'Integration | Component | users grid', {
        integration: true
    });

    (0, _emberQunit.test)('it renders', function (assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.on('myAction', function(val) { ... });

        this.render(Ember.HTMLBars.template((function () {
            return {
                meta: {
                    'fragmentReason': {
                        'name': 'missing-wrapper',
                        'problems': ['wrong-type']
                    },
                    'revision': 'Ember@2.4.6',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 1,
                            'column': 14
                        }
                    }
                },
                isEmpty: false,
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createComment('');
                    dom.appendChild(el0, el1);
                    return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                    var morphs = new Array(1);
                    morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
                    dom.insertBoundary(fragment, 0);
                    dom.insertBoundary(fragment, null);
                    return morphs;
                },
                statements: [['content', 'users-grid', ['loc', [null, [1, 0], [1, 14]]]]],
                locals: [],
                templates: []
            };
        })()));

        assert.equal(this.$().text().trim(), '');

        // Template block usage:
        this.render(Ember.HTMLBars.template((function () {
            var child0 = (function () {
                return {
                    meta: {
                        'fragmentReason': false,
                        'revision': 'Ember@2.4.6',
                        'loc': {
                            'source': null,
                            'start': {
                                'line': 2,
                                'column': 4
                            },
                            'end': {
                                'line': 4,
                                'column': 4
                            }
                        }
                    },
                    isEmpty: false,
                    arity: 0,
                    cachedFragment: null,
                    hasRendered: false,
                    buildFragment: function buildFragment(dom) {
                        var el0 = dom.createDocumentFragment();
                        var el1 = dom.createTextNode('      template block text\n');
                        dom.appendChild(el0, el1);
                        return el0;
                    },
                    buildRenderNodes: function buildRenderNodes() {
                        return [];
                    },
                    statements: [],
                    locals: [],
                    templates: []
                };
            })();

            return {
                meta: {
                    'fragmentReason': {
                        'name': 'missing-wrapper',
                        'problems': ['wrong-type']
                    },
                    'revision': 'Ember@2.4.6',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 5,
                            'column': 2
                        }
                    }
                },
                isEmpty: false,
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createTextNode('\n');
                    dom.appendChild(el0, el1);
                    var el1 = dom.createComment('');
                    dom.appendChild(el0, el1);
                    var el1 = dom.createTextNode('  ');
                    dom.appendChild(el0, el1);
                    return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                    var morphs = new Array(1);
                    morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
                    return morphs;
                },
                statements: [['block', 'users-grid', [], [], 0, null, ['loc', [null, [2, 4], [4, 19]]]]],
                locals: [],
                templates: [child0]
            };
        })()));

        assert.equal(this.$().text().trim(), 'template block text');
    });
});
define('apem/tests/integration/components/users-grid-test.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - integration/components/users-grid-test.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'integration/components/users-grid-test.js should pass jshint.');
    });
});
define('apem/tests/integration/pods/components/confirm-delete/component-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

    (0, _emberQunit.moduleForComponent)('confirm-delete', 'Integration | Component | confirm delete', {
        integration: true
    });

    (0, _emberQunit.test)('it renders', function (assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.on('myAction', function(val) { ... });

        this.render(Ember.HTMLBars.template((function () {
            return {
                meta: {
                    'fragmentReason': {
                        'name': 'missing-wrapper',
                        'problems': ['wrong-type']
                    },
                    'revision': 'Ember@2.4.6',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 1,
                            'column': 18
                        }
                    }
                },
                isEmpty: false,
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createComment('');
                    dom.appendChild(el0, el1);
                    return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                    var morphs = new Array(1);
                    morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
                    dom.insertBoundary(fragment, 0);
                    dom.insertBoundary(fragment, null);
                    return morphs;
                },
                statements: [['content', 'confirm-delete', ['loc', [null, [1, 0], [1, 18]]]]],
                locals: [],
                templates: []
            };
        })()));

        assert.equal(this.$().text().trim(), '');

        // Template block usage:
        this.render(Ember.HTMLBars.template((function () {
            var child0 = (function () {
                return {
                    meta: {
                        'fragmentReason': false,
                        'revision': 'Ember@2.4.6',
                        'loc': {
                            'source': null,
                            'start': {
                                'line': 2,
                                'column': 4
                            },
                            'end': {
                                'line': 4,
                                'column': 4
                            }
                        }
                    },
                    isEmpty: false,
                    arity: 0,
                    cachedFragment: null,
                    hasRendered: false,
                    buildFragment: function buildFragment(dom) {
                        var el0 = dom.createDocumentFragment();
                        var el1 = dom.createTextNode('      template block text\n');
                        dom.appendChild(el0, el1);
                        return el0;
                    },
                    buildRenderNodes: function buildRenderNodes() {
                        return [];
                    },
                    statements: [],
                    locals: [],
                    templates: []
                };
            })();

            return {
                meta: {
                    'fragmentReason': {
                        'name': 'missing-wrapper',
                        'problems': ['wrong-type']
                    },
                    'revision': 'Ember@2.4.6',
                    'loc': {
                        'source': null,
                        'start': {
                            'line': 1,
                            'column': 0
                        },
                        'end': {
                            'line': 5,
                            'column': 2
                        }
                    }
                },
                isEmpty: false,
                arity: 0,
                cachedFragment: null,
                hasRendered: false,
                buildFragment: function buildFragment(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createTextNode('\n');
                    dom.appendChild(el0, el1);
                    var el1 = dom.createComment('');
                    dom.appendChild(el0, el1);
                    var el1 = dom.createTextNode('  ');
                    dom.appendChild(el0, el1);
                    return el0;
                },
                buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
                    var morphs = new Array(1);
                    morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
                    return morphs;
                },
                statements: [['block', 'confirm-delete', [], [], 0, null, ['loc', [null, [2, 4], [4, 23]]]]],
                locals: [],
                templates: [child0]
            };
        })()));

        assert.equal(this.$().text().trim(), 'template block text');
    });
});
define('apem/tests/integration/pods/components/confirm-delete/component-test.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - integration/pods/components/confirm-delete/component-test.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'integration/pods/components/confirm-delete/component-test.js should pass jshint.');
    });
});
define('apem/tests/mirage/config.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - mirage/config.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'mirage/config.js should pass jshint.');
    });
});
define('apem/tests/mirage/factories/user.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - mirage/factories/user.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'mirage/factories/user.js should pass jshint.');
    });
});
define('apem/tests/mirage/scenarios/default.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - mirage/scenarios/default.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'mirage/scenarios/default.js should pass jshint.');
    });
});
define('apem/tests/models/field.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - models/field.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'models/field.js should pass jshint.');
    });
});
define('apem/tests/models/opportunity.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - models/opportunity.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'models/opportunity.js should pass jshint.');
    });
});
define('apem/tests/models/profile.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - models/profile.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'models/profile.js should pass jshint.');
    });
});
define('apem/tests/models/user.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - models/user.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'models/user.js should pass jshint.');
    });
});
define('apem/tests/overrides/model.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - overrides/model.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'overrides/model.js should pass jshint.');
    });
});
define('apem/tests/pods/application/controller.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/application/controller.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/application/controller.js should pass jshint.');
    });
});
define('apem/tests/pods/application/route.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/application/route.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/application/route.js should pass jshint.');
    });
});
define('apem/tests/pods/components/confirm-delete/component.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/components/confirm-delete/component.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/components/confirm-delete/component.js should pass jshint.');
    });
});
define('apem/tests/pods/components/error-message/component.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/components/error-message/component.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/components/error-message/component.js should pass jshint.');
    });
});
define('apem/tests/pods/components/fields/fld-table/component.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/components/fields/fld-table/component.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/components/fields/fld-table/component.js should pass jshint.');
    });
});
define('apem/tests/pods/components/hover-edit-field/component.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/components/hover-edit-field/component.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/components/hover-edit-field/component.js should pass jshint.');
    });
});
define('apem/tests/pods/components/opportunities/opp-table/component.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/components/opportunities/opp-table/component.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/components/opportunities/opp-table/component.js should pass jshint.');
    });
});
define('apem/tests/pods/components/ui-form/ui-checkbox/component.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/components/ui-form/ui-checkbox/component.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/components/ui-form/ui-checkbox/component.js should pass jshint.');
    });
});
define('apem/tests/pods/components/ui-form/ui-textfield/component.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/components/ui-form/ui-textfield/component.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/components/ui-form/ui-textfield/component.js should pass jshint.');
    });
});
define('apem/tests/pods/components/ui-layout/nav-header/component.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/components/ui-layout/nav-header/component.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/components/ui-layout/nav-header/component.js should pass jshint.');
    });
});
define('apem/tests/pods/components/ui-layout/nav-sidebar/component.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/components/ui-layout/nav-sidebar/component.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/components/ui-layout/nav-sidebar/component.js should pass jshint.');
    });
});
define('apem/tests/pods/components/users/usr-table/component.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/components/users/usr-table/component.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/components/users/usr-table/component.js should pass jshint.');
    });
});
define('apem/tests/pods/fields/index/route.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/fields/index/route.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/fields/index/route.js should pass jshint.');
    });
});
define('apem/tests/pods/fields/route.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/fields/route.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/fields/route.js should pass jshint.');
    });
});
define('apem/tests/pods/opportunities/index/route.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/opportunities/index/route.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/opportunities/index/route.js should pass jshint.');
    });
});
define('apem/tests/pods/opportunities/new/route.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/opportunities/new/route.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/opportunities/new/route.js should pass jshint.');
    });
});
define('apem/tests/pods/opportunities/opportunity/controller.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/opportunities/opportunity/controller.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/opportunities/opportunity/controller.js should pass jshint.');
    });
});
define('apem/tests/pods/opportunities/opportunity/detail/route.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/opportunities/opportunity/detail/route.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/opportunities/opportunity/detail/route.js should pass jshint.');
    });
});
define('apem/tests/pods/opportunities/opportunity/index/route.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/opportunities/opportunity/index/route.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/opportunities/opportunity/index/route.js should pass jshint.');
    });
});
define('apem/tests/pods/opportunities/opportunity/route.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/opportunities/opportunity/route.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/opportunities/opportunity/route.js should pass jshint.');
    });
});
define('apem/tests/pods/opportunities/route.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/opportunities/route.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/opportunities/route.js should pass jshint.');
    });
});
define('apem/tests/pods/users/index/route.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/users/index/route.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/users/index/route.js should pass jshint.');
    });
});
define('apem/tests/pods/users/new/controller.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/users/new/controller.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/users/new/controller.js should pass jshint.');
    });
});
define('apem/tests/pods/users/new/route.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/users/new/route.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/users/new/route.js should pass jshint.');
    });
});
define('apem/tests/pods/users/route.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/users/route.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/users/route.js should pass jshint.');
    });
});
define('apem/tests/pods/users/user/controller.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/users/user/controller.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/users/user/controller.js should pass jshint.');
    });
});
define('apem/tests/pods/users/user/detail/controller.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/users/user/detail/controller.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/users/user/detail/controller.js should pass jshint.');
    });
});
define('apem/tests/pods/users/user/detail/route.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/users/user/detail/route.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/users/user/detail/route.js should pass jshint.');
    });
});
define('apem/tests/pods/users/user/index/route.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/users/user/index/route.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/users/user/index/route.js should pass jshint.');
    });
});
define('apem/tests/pods/users/user/route.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - pods/users/user/route.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'pods/users/user/route.js should pass jshint.');
    });
});
define('apem/tests/resolver.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - resolver.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'resolver.js should pass jshint.');
    });
});
define('apem/tests/router.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - router.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'router.js should pass jshint.');
    });
});
define('apem/tests/routes/fields.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - routes/fields.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'routes/fields.js should pass jshint.');
    });
});
define('apem/tests/services/identity.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - services/identity.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'services/identity.js should pass jshint.');
    });
});
define('apem/tests/test-helper', ['exports', 'apem/tests/helpers/resolver', 'ember-qunit'], function (exports, _apemTestsHelpersResolver, _emberQunit) {

    (0, _emberQunit.setResolver)(_apemTestsHelpersResolver['default']);
});
define('apem/tests/test-helper.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - test-helper.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'test-helper.js should pass jshint.');
    });
});
define('apem/tests/unit/adapters/application-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

    (0, _emberQunit.moduleFor)('adapter:application', 'Unit | Adapter | application', {
        // Specify the other units that are required for this test.
        // needs: ['serializer:foo']
    });

    // Replace this with your real tests.
    (0, _emberQunit.test)('it exists', function (assert) {
        var adapter = this.subject();
        assert.ok(adapter);
    });
});
define('apem/tests/unit/adapters/application-test.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - unit/adapters/application-test.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'unit/adapters/application-test.js should pass jshint.');
    });
});
define('apem/tests/unit/helpers/currency-format-test', ['exports', 'apem/helpers/currency-format', 'qunit'], function (exports, _apemHelpersCurrencyFormat, _qunit) {

    (0, _qunit.module)('Unit | Helper | currency format');

    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
        var result = (0, _apemHelpersCurrencyFormat.currencyFormat)([42]);
        assert.ok(result);
    });
});
define('apem/tests/unit/helpers/currency-format-test.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - unit/helpers/currency-format-test.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'unit/helpers/currency-format-test.js should pass jshint.');
    });
});
define('apem/tests/unit/models/field-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

    (0, _emberQunit.moduleForModel)('field', 'Unit | Model | field', {
        // Specify the other units that are required for this test.
        needs: []
    });

    (0, _emberQunit.test)('it exists', function (assert) {
        var model = this.subject();
        // let store = this.store();
        assert.ok(!!model);
    });
});
define('apem/tests/unit/models/field-test.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - unit/models/field-test.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'unit/models/field-test.js should pass jshint.');
    });
});
define('apem/tests/unit/models/user-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

    (0, _emberQunit.moduleForModel)('user', 'Unit | Model | user', {
        // Specify the other units that are required for this test.
        needs: []
    });

    (0, _emberQunit.test)('it exists', function (assert) {
        var model = this.subject();
        // let store = this.store();
        assert.ok(!!model);
    });
});
define('apem/tests/unit/models/user-test.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - unit/models/user-test.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'unit/models/user-test.js should pass jshint.');
    });
});
define('apem/tests/unit/pods/application/model-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

    (0, _emberQunit.moduleForModel)('application', 'Unit | Model | application', {
        // Specify the other units that are required for this test.
        needs: []
    });

    (0, _emberQunit.test)('it exists', function (assert) {
        var model = this.subject();
        // let store = this.store();
        assert.ok(!!model);
    });
});
define('apem/tests/unit/pods/application/model-test.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - unit/pods/application/model-test.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'unit/pods/application/model-test.js should pass jshint.');
    });
});
define('apem/tests/unit/pods/application/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

    (0, _emberQunit.moduleFor)('route:application', 'Unit | Route | application', {
        // Specify the other units that are required for this test.
        // needs: ['controller:foo']
    });

    (0, _emberQunit.test)('it exists', function (assert) {
        var route = this.subject();
        assert.ok(route);
    });
});
define('apem/tests/unit/pods/application/route-test.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - unit/pods/application/route-test.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'unit/pods/application/route-test.js should pass jshint.');
    });
});
define('apem/tests/unit/pods/fields/route-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

    (0, _emberQunit.moduleFor)('route:fields', 'Unit | Route | fields', {
        // Specify the other units that are required for this test.
        // needs: ['controller:foo']
    });

    (0, _emberQunit.test)('it exists', function (assert) {
        var route = this.subject();
        assert.ok(route);
    });
});
define('apem/tests/unit/pods/fields/route-test.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - unit/pods/fields/route-test.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'unit/pods/fields/route-test.js should pass jshint.');
    });
});
define('apem/tests/unit/routes/fields-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

    (0, _emberQunit.moduleFor)('route:fields', 'Unit | Route | fields', {
        // Specify the other units that are required for this test.
        // needs: ['controller:foo']
    });

    (0, _emberQunit.test)('it exists', function (assert) {
        var route = this.subject();
        assert.ok(route);
    });
});
define('apem/tests/unit/routes/fields-test.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - unit/routes/fields-test.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'unit/routes/fields-test.js should pass jshint.');
    });
});
define('apem/tests/unit/routes/user-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

    (0, _emberQunit.moduleFor)('route:user', 'Unit | Route | user', {
        // Specify the other units that are required for this test.
        // needs: ['controller:foo']
    });

    (0, _emberQunit.test)('it exists', function (assert) {
        var route = this.subject();
        assert.ok(route);
    });
});
define('apem/tests/unit/routes/user-test.jshint', ['exports'], function (exports) {
    'use strict';

    QUnit.module('JSHint - unit/routes/user-test.js');
    QUnit.test('should pass jshint', function (assert) {
        assert.expect(1);
        assert.ok(true, 'unit/routes/user-test.js should pass jshint.');
    });
});
/* jshint ignore:start */

require('apem/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map