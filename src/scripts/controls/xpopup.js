export default class xPopup {

  constructor (elem, options) {
    this.settings = {
      dialogClass: 'xpopup__dialog',
      toggleSelector: null,
    };

    for (var attrname in options) {
      this.settings[attrname] = options[attrname];
    }

    this.container = elem;

    for (var attrname in this.settings) {
      if (this.container.dataset[attrname] !== undefined) {
        this.settings[attrname] = this.container.dataset[attrname];
      }
    }
    if (this.container.dataset.toggle) {
      this.settings.toggleSelector = this.container.dataset.toggle;
    }

    this.dialog = this.container.querySelector('.' + this.settings.dialogClass);
    this.toggles = document.querySelectorAll(this.settings.toggleSelector);
    this.closeButtons = this.container.querySelectorAll('[data-close]');

    elem.xForm = this;
  }

  toggleEvent (name) {
    var event = document.createEvent('Event');
    event.initEvent(name, true, true);
    this.container.dispatchEvent(event);
  }

  getScrollbarWidth () {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
  }

  show () {
    this.container.classList.add('is-active');
    document.body.style.marginRight = this.getScrollbarWidth() + 'px';
    document.body.style.overflow = 'hidden';
    this.toggleEvent('show');
  }

  hide () {
    this.container.classList.remove('is-active');
    document.body.style.marginRight = null;
    document.body.style.overflow = null;
    this.toggleEvent('hide');
  }

  _toggleClick = function (e) {
    e.preventDefault();
    this.show();
    return false;
  }
  _toggleContainerClick = function (e) {
    if (e.target === this.container) {
      this.hide();
    }
  }
  _closeClick = function (e) {
    this.hide();
    return false;
  }
  _escapePress = function (e) {
    if (e.key === 'Escape') {
      this.hide();
    }
  }

  mount () {
    var _this = this;
    this._toggleClickHandler = this._toggleClick.bind(this);
    this._toggleContainerClickHandler = this._toggleContainerClick.bind(this);
    this._closeClickHandler = this._closeClick.bind(this);
    this._escapePressHandler = this._escapePress.bind(this);
    this.toggles.forEach(function (item) {
      item.addEventListener('click', _this._toggleClickHandler);
    });
    this.container.addEventListener('click', this._toggleContainerClickHandler);
    this.closeButtons.forEach(function (item) {
      item.addEventListener('click', _this._closeClickHandler);
    });
    document.addEventListener('keyup', _this._escapePressHandler);
    this.toggleEvent('mount');
  }

  unmount () {
    var _this = this;
    this.toggles.forEach(function (item) {
      item.removeEventListener('click', _this._toggleClickHandler);
    });
    this.closeButtons.forEach(function (item) {
      item.removeEventListener('click', _this._closeClickHandler);
    });
    this.container.removeEventListener('click', this._toggleContainerClickHandler);
    document.removeEventListener('keyup', _this._escapePressHandler);
  }

  destroy () {
    this.unmount();
    delete(this.container.xPopup);
  }

}