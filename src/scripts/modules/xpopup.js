(function() {

  this.xPopup = function (elem, options) {
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

  xPopup.prototype.toggleEvent = function (name) {
    var event = document.createEvent('Event');
    event.initEvent(name, true, true);
    this.container.dispatchEvent(event);
  }

  xPopup.prototype.show = function () {
    this.container.classList.add('is-active');
    document.body.style.marginRight = getScrollbarWidth() + 'px';
    document.body.style.overflow = 'hidden';
    this.toggleEvent('show');
  }

  xPopup.prototype.hide = function () {
    this.container.classList.remove('is-active');
    document.body.style.marginRight = null;
    document.body.style.overflow = null;
    this.toggleEvent('hide');
  }

  xPopup.prototype._toggleClick = function (e) {
    this.show();
    return false;
  }
  xPopup.prototype._toggleContainerClick = function (e) {
    if (e.target === this.container) {
      this.hide();
    }
  }
  xPopup.prototype._closeClick = function (e) {
    this.hide();
    return false;
  }
  xPopup.prototype._escapePress = function (e) {
    if (e.key === 'Escape') {
      this.hide();
    }
  }

  xPopup.prototype.mount = function () {
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

  xPopup.prototype.unmount = function () {
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

  xPopup.prototype.destroy = function () {
    this.unmount();
    delete(this.container.xPopup);
  }

}());