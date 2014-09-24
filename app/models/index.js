/**
 * Model registry
 */
module.exports = {
  register: function (model) {
    this[model.name] = model;
  }
};