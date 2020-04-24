export default class xMap {

  constructor (elem, options) {
    this.settings = {
      zoom: 15,
      lat: 37.618552,
      lng: 55.756895,
      markersSelector: null,
      autoHeight: true,
      icon: null,
      iconSize: null,
      iconOffset: null,
    };
    for (var attrname in options) {
      this.settings[attrname] = options[attrname];
    }

    this.container = elem;

    var _this = this;

    for (var attrname in this.settings) {
      if (this.container.dataset[attrname] !== undefined) {
        if (attrname == 'iconSize' || attrname == 'iconOffset') {
          this.settings[attrname] = JSON.parse(this.container.dataset[attrname]);
        } else {
          this.settings[attrname] = this.container.dataset[attrname];
        }
      }
    }

    this.markerElements = [];
    if (this.settings.markersSelector) {
      this.markerElements = this.container.querySelectorAll(this.settings.markersSelector);
    } else {
      //this.markerElements = this.container.querySelectorAll(":scope > *");
      this.markerElements = this.container.children;
    }

    this.markers = [];

    elem.xMap = this;
  }

  toggleEvent (name) {
    var event = document.createEvent('Event');
    event.initEvent(name, true, true);
    this.container.dispatchEvent(event);
  }

  loadMarkers () {
    var _this = this;
    [].forEach.call(this.markerElements, function (item) {
      var markerOptions = {};
      var icon = item.dataset.icon || _this.settings.icon;
      var iconSize = item.dataset.iconSize ? JSON.parse(item.dataset.iconSize) : _this.settings.iconSize;
      var iconOffset = item.dataset.iconOffset ? JSON.parse(item.dataset.iconOffset) : _this.settings.iconOffset;
      if (icon && iconSize && iconOffset) {
        markerOptions.iconLayout = 'default#image';
        markerOptions.iconImageHref = icon;
        markerOptions.iconImageSize = iconSize;
        markerOptions.iconImageOffset = iconOffset;
      }
      var marker = new ymaps.Placemark([item.dataset.lat, item.dataset.lng], {
        hintContent: item.dataset.title,
        balloonContentBody: item.innerHTML,
        balloonContentHeader: item.dataset.title,
      }, markerOptions);
      _this.markers.push(marker);
      item.style.display = 'none';
    });
  }

  initMap () {
    var _this = this;

    this.ymap = new ymaps.Map(this.container.id, {
      center: [_this.settings.lat, _this.settings.lng],
      zoom: _this.settings.zoom,
    });
    [].forEach.call(this.markers, function (item) {
      _this.ymap.geoObjects.add(item);
    });
    this.ymap.behaviors.disable('scrollZoom');
    this.ymap.controls.remove('trafficControl');
    this.ymap.controls.remove('searchControl');
    this.ymap.controls.remove('rulerControl');
    this.ymap.controls.remove('typeSelector');
  }

  _windowResizeHandler (e) {
    //console.log(this);
  }

  mount () {
    var _this = this;
    this.container.id = this.container.id || 'map-' + Math.random().toString(36).substr(2, 10);
    this.toggleEvent('mount');
    this.resizeTimout = null;
    ymaps.ready(function () {
      _this.loadMarkers();
      _this.initMap();
      _this.refresh();
      window.xMapInstance = _this;
      //window.addEventListener('resize', _this._windowResizeHandler);
    });
  }

  refresh () {
    if (this.settings.autoHeight) {
      this.container.style.height = null;
      var maxHeight = Math.round(document.documentElement.clientHeight * .6);
      if (this.container.offsetHeight > maxHeight) {
        this.container.style.height = maxHeight + 'px';
      }
    }
    this.ymap.container.fitToViewport();
  }

  unmount () {
    this.container.id = null;
    this.container.style.height = null;
    [].forEach.call(this.markerElements, function (item) {
      item.style.display = null;
    });
    //window.removeEventListener('resize', this._windowResizeHandler);
    this.ymap.destroy();
  }

  destroy () {
    this.unmount();
    delete(this.container.xMap);
  }

}