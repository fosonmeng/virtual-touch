import defaults from './defaults';
import Manager from './manager.js';

export default class VirtualTouch {
  constructor(virtual, options) {
    if (!options) {
      options = {};
    }
    if (!options.recognizers) {
      options.recognizers = this.defaults.preset;
    }
    return new Manager(virtual, options);
  }
}

VirtualTouch.prototype.defaults = defaults;
