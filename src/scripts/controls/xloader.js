export default class xLoader {

  constructor (elem, options) {
    this.settings = {
      url: null,
      itemsSelector: null,
      toggleSelector: null,
      filterFormSelector: null,
      disableToggle: true,
      loadingClass: 'is-loading',
      finishedClass: 'is-finished',
      deletingClass: 'is-deleting',
      loadOnMount: true,
      clearAfterLoad: false,
      append: true,
    };
    for (var attrname in options) {
      this.settings[attrname] = options[attrname];
    }

    if (!this.settings.url) {
      this.settings.url = location.href;
    }

    this.container = elem;
    for (var attrname in this.settings) {
      if (this.container.dataset[attrname] !== undefined) {
        this.settings[attrname] = this.container.dataset[attrname];
      }
    }

    if (this.container.dataset.items) {
      this.settings.itemsSelector = this.container.dataset.items;
    }
    if (this.container.dataset.toggle) {
      this.settings.toggleSelector = this.container.dataset.toggle;
    }
    if (this.container.dataset.filterForm) {
      this.settings.filterFormSelector = this.container.dataset.filterForm;
    }

    elem.xLoader = this;
  }

  refreshParams () {
    var params = {};
    if (this.container.dataset.params) {
      params = JSON.parse(this.container.dataset.params);
    }
    params.start = this.items ? this.items.length : 0;
    this.params = Object.keys(params).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');
    if (this.filterForm) {
      var formData = new FormData(this.filterForm);
      filters = [...formData.entries()].map(function(k) {
        return encodeURIComponent(k[0]) + '=' + encodeURIComponent(k[1]);
      }).join('&');
      if (filters) {
        this.params += '&' + filters;
      }
    }
  }

  toggleEvent (name) {
    var event = document.createEvent('Event');
    event.initEvent(name, true, true);
    this.container.dispatchEvent(event);
  }

  loadItems () {
    if (this.settings.itemsSelector) {
      this.items = this.container.querySelectorAll(this.settings.itemsSelector);
    } else {
      this.items = this.container.querySelectorAll(":scope > *");
    }
  }

  markForClear () {
    var _this = this;

    this.loadItems();
    [].forEach.call(this.items, function (item) {
      item.classList.add(_this.settings.deletingClass);
    });
  }

  clearMarked () {
    var _this = this;

    this.loadItems();
    [].forEach.call(this.items, function (item) {
      if (item.classList.contains(_this.settings.deletingClass)) {
        item.remove();
      }
    });
    this.toggleEvent('clear');
  }

  clear () {
    var _this = this;

    this.loadItems();
    [].forEach.call(this.items, function (item) {
      item.remove();
    });
    this.toggleEvent('clear');
  }

  reload () {
    if (this.settings.clearAfterLoad == true) {
      this.markForClear();
    } else {
      this.clear();
    }
    this.load();
  }

  beforeLoad () {
    var _this = this;

    this.container.classList.remove(this.settings.finishedClass);
    this.container.classList.add(this.settings.loadingClass);
    if (this.filterForm) {
      this.filterForm.classList.add(this.settings.loadingClass);
    }
    this.toggles.forEach(function (item) {
      if (_this.settings.disableToggle == true) {
        item.disabled = true;
      }
      item.classList.add(_this.settings.loadingClass);
    });
    this.toggleEvent('beforeLoad');
  }

  afterLoad () {
    var _this = this;

    this.container.classList.remove(this.settings.loadingClass);
    if (this.filterForm) {
      this.filterForm.classList.remove(this.settings.loadingClass);
    }
    this.toggles.forEach(function (item) {
      if (_this.settings.disableToggle == true) {
        item.disabled = false;
      }
      item.classList.remove(_this.settings.loadingClass);
    });
    this.toggleEvent('afterLoad');
  }

  afterFinish () {
    var _this = this;

    this.container.classList.add(this.settings.finishedClass);
    if (this.filterForm) {
      this.filterForm.classList.add(this.settings.loadingClass);
    }
    this.toggles.forEach(function (item) {
      if (_this.settings.disableToggle) {
        item.disabled = true;
      }
      item.classList.add(_this.settings.finishedClass);
    });
    this.toggleEvent('finish');
  }

  load () {
    var _this = this;

    this.loadItems();
    if (this.settings.append == false) {
      if (this.settings.clearAfterLoad == false) {
        this.clear();
      } else {
        this.markForClear();
      }
    }

    this.refreshParams();

    var url = this.settings.url;
    if (url.indexOf('?') > -1) {
      url += '&' + this.params;
    } else {
      url += '?' + this.params;
    }

    this.beforeLoad();

    var xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.responseType = 'json';

    xhr.onload = function () {
      var data = xhr.response;
      if (data.html) {
        _this.loadItems();
        if (_this.items.length) {
          _this.items[_this.items.length - 1].insertAdjacentHTML('afterend', data.html);
        } else {
          _this.container.insertAdjacentHTML('afterbegin', data.html);
        }
        _this.toggleEvent('load');
      }
      if (!_this.settings.append && _this.settings.clearAfterLoad) {
        _this.clearMarked();
      }
      _this.afterLoad();
      if (data.last) {
        _this.afterFinish();
      }
    }

    xhr.onerror = function () {
      _this.toggleEvent('error');
    }

    xhr.send();

    return this;
  }

  bind () {
    var _this = this;

    this.toggles = document.querySelectorAll(this.settings.toggleSelector);
    this.filterForm = document.querySelector(this.settings.filterFormSelector);

    this.toggles.forEach(function (item) { item.addEventListener('click', function () { _this.load(); }) });

    if (this.filterForm) {
      this.filterForm.addEventListener('change', function () {
        _this.reload();
      });
    }
  }

  mount () {
    this.toggleEvent('mount');
    this.bind();

    if (this.settings.loadOnMount == true) {
      this.load();
    }
  }

}