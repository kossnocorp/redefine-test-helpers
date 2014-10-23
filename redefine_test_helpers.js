/**
 * Set of helpers that helps to redefine internals of objects.
 */
var RedefineTestHelpers = {
  /**
   * Redefines specified internals and returns restore function.
   *
   * @param {object} target - object to be redefined
   * @param {object} overrides - object, where key is property name and value
   * is an override.
   * @returns {function} restore function that rollbacks all overrides
   *
   * @example
   * beforeEach(function() {
   *   this.restoreStore = RedefineTestHelpers.redefine(store, {
   *     request: sinon.spy()
   *   });
   * });
   *
   * afterEach(function() {
   *   this.restoreStore()
   * });
   */
  redefine: function(target, overrides) {
    var originals = {};
    Object.keys(overrides).forEach(function(propertyName) {
      originals[propertyName] = target[propertyName];
      target[propertyName] = overrides[propertyName];
    });

    return function() {
      Object.keys(overrides).forEach(function(propertyName) {
        target[propertyName] = originals[propertyName];
      });
    };
  },

  /**
   * Redefine specified properties in beforeEach filter and restore them in
   * afterEach.
   *
   * @param {Object} target - object to be redefined.
   * @param {Object} overrides - object, where key is property name and value
   * is an override.
   */
  redefineFilter: function(target, overrides) {
    beforeEach(function() {
      this.restoreRedefinedProperties =
        RedefineTestHelpers.redefine(target, overrides);
    });

    afterEach(function() {
      this.restoreRedefinedProperties();
    });
  },

  /**
   * Redefines specified internals and returns restore function.
   *
   * @param {object} target - object to be redefined.
   * @param {object} overrides - object, where key is property name and value
   * is an override.
   * @param {function} fn - function to be called.
   *
   * @example
   * var requestSpy = sinon.spy();
   * RedefineTestHelpers.redefined(store, { request: requestSpy }, function() {
   *   request.get('/downloads');
   *   expect(requestSpy).to.be.calledWith('GET');
   * });
   */
  redefined: function(target, overrides, fn) {
    var restore = RedefineTestHelpers.redefine(target, overrides);
    fn();
    restore();
  }
};

module.exports = RedefineTestHelpers;

