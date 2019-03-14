(function() {

    function transitionDuration (elem) {
        var cStyle = window.getComputedStyle(elem);
        var value = cStyle.getPropertyValue('transition-duration');
        var isMs = value.indexOf('ms') >= 0;
        var duration = parseFloat(value);
        return isMs ? duration : duration * 1000;
    };

    function flexBasis (elem) {
        var cStyle = window.getComputedStyle(elem);
        return cStyle.getPropertyValue('flex-basis');
    }

    function clickHandler (e) {
        e.preventDefault();
    }

    this.xSlider = function (elem, options) {
        this.settings = {
            loop: false,
            loopActive: true,
            autoHeight: false,
            startAt: 0,
            perSlide: 1,
            autoplay: 0,
            lazyLoad: 2,
            pauseOnHover: false,
            disableButtons: true,
            threshold: 50,
            moveToFirst: false,
            movingClass: 'is-moving',
            disabledClass: 'is-disabled',
            currentClass: 'is-current',
            activeClass: 'is-active',
        };
        for (var attrname in options) {
            this.settings[attrname] = options[attrname];
        }

        this.slider = elem;
        this.viewport = this.slider.querySelector('[data-viewport]');
        this.track = this.viewport.querySelector('[data-track]');
        this.prevButtons = this.slider.querySelectorAll('[data-prev]');
        this.nextButtons = this.slider.querySelectorAll('[data-next]');
        this.firstButtons = this.slider.querySelectorAll('[data-first]');
        this.lastButtons = this.slider.querySelectorAll('[data-last]');
        this.items = this.track.children;
        this.count = this.items.length;

        this.duration = transitionDuration(this.track);
        if (this.settings.autoplay > 0 && this.settings.autoplay < this.duration) {
            this.settings.autoplay = this.duration;
        }
        this.flexBasis = flexBasis(this.items[0]);
        if (this.flexBasis.indexOf('%') < 0) {
            this.flexBasis = 'auto';
        }

        this.current = 0;
        this.prev = null;
        this.inTransition = false;
        this.activeItems = [];
        this.canPlay = true;

        this.isMoving = false;

        elem.xSlider = this;
    }

    xSlider.prototype.goTo = function (index) {
        if (index < 0) {
            if (!this.settings.loop) {
                this.current = 0;
            } else {
                if (this.current < this.settings.perSlide && this.current > 0) {
                    this.current = 0;
                } else {
                    if (this.settings.loopActive && (this.count + index) >= this.maxCurrent) {
                        this.current = this.maxCurrent;
                    } else {
                        this.current = this.count - 1;
                    }
                }
            }
        } else if (index > this.count - 1) {
            if (!this.settings.loop) {
                this.current = this.count - 1;
            } else {
                this.current = 0;
            }
        } else {
            if (!this.settings.loop) {
                this.current = index;
            } else {
                if (this.settings.loopActive && index >= this.maxCurrent) {
                    if (this.current < this.maxCurrent) {
                        this.current = this.maxCurrent;
                    } else {
                        this.current = 0;
                    }
                } else {
                    this.current = index;
                }
            }
        }

        return this.reposition();
    }

    xSlider.prototype.recalc = function () {
        var _this = this;
        this.itemWidth = 100;
        var width = 0;
        [].forEach.call(this.items, function (item) {
            item.style.flexBasis = null;
        });
        if (this.flexBasis == 'auto') {
            var viewportWidth = this.viewport.offsetWidth;
            var elemWidth = this.items[0].offsetWidth;
            this.perView = Math.floor(viewportWidth / elemWidth);
            if (this.perView > this.count) {
                this.perView = this.count;
            }
            width = 100 / this.perView;
        } else {
            width = parseFloat(this.flexBasis);
            this.perView = Math.floor(100 / width);
            if (this.perView < 1) {
                this.perView = 1;
            }
        }
        if (width > 0 && width <= 100) {
            this.itemWidth = width;
        }
        if (this.flexBasis == 'auto') {
            [].forEach.call(this.items, function (item) {
                item.style.flexBasis = _this.itemWidth + '%';
            });
        }

        if (this.settings.perSlide == 'auto') {
            this.settings.perSlide = this.perView;
        }

        this.maxCurrent = this.count - this.perView;

        return this;
    }

    xSlider.prototype.refreshButtonsState = function () {
        var _this = this;
        if (!this.settings.loop && this.settings.disableButtons) {
            var buttons = [];
            var disabledButtons = [];
            if (this.current == 0) {
                buttons.push.apply(buttons, this.nextButtons);
                buttons.push.apply(buttons, this.lastButtons);
                disabledButtons.push.apply(disabledButtons, this.prevButtons);
                disabledButtons.push.apply(disabledButtons, this.firstButtons);
            } else if (this.current >= this.maxCurrent) {
                buttons.push.apply(buttons, this.prevButtons);
                buttons.push.apply(buttons, this.firstButtons);
                disabledButtons.push.apply(disabledButtons, this.nextButtons);
                disabledButtons.push.apply(disabledButtons, this.lastButtons);
            } else {
                buttons.push.apply(buttons, this.prevButtons);
                buttons.push.apply(buttons, this.firstButtons);
                buttons.push.apply(buttons, this.nextButtons);
                buttons.push.apply(buttons, this.lastButtons);
            }
            disabledButtons.forEach(function (item) {
                item.disabled = true;
                item.tabindex = -1;
                item.classList.add(_this.settings.disabledClass);
            });
            buttons.forEach(function (item) {
                item.disabled = false;
                item.removeAttribute('tabindex');
                item.classList.remove(_this.settings.disabledClass);
            });
        }
    }

    xSlider.prototype.reposition = function () {
        var _this = this;
        var first = this.current;
        if (first > this.maxCurrent) {
            first = this.maxCurrent;
        }

        this.refreshButtonsState();

        [].forEach.call(this.items, function (item) {
            item.classList.remove(_this.settings.currentClass);
            item.classList.remove(_this.settings.activeClass);
        });
        var lazyLoadItems = [].slice.call(this.items, first, first + this.perView * (this.settings.lazyLoad + 1));
        var lazyLoadAdd = [];
        if (first < this.perView) {
            lazyLoadAdd = [].slice.call(this.items, -1 * this.perView * (this.settings.lazyLoad + 1));
        } else {
            lazyLoadAdd = [].slice.call(this.items, first - this.perView * (this.settings.lazyLoad + 1), first);
        }
        lazyLoadAdd.forEach(function (item) {
            if (lazyLoadItems.indexOf(item) == -1) {
                lazyLoadItems.push(item);
            }
        });
        lazyLoadItems.forEach(function (item) {
            var lazyLoadObjects = item.querySelectorAll('[data-src]');
            lazyLoadObjects.forEach(function (obj) {
                obj.src = obj.dataset.src;
                delete obj.dataset.src;
            });
        });
        var maxHeight = 0;
        this.activeItems = [].slice.call(this.items, first, first + this.perView);
        this.activeItems.forEach(function (item) {
            item.classList.add(_this.settings.activeClass);
            if (item.offsetHeight > maxHeight) {
                maxHeight = item.offsetHeight;
            }
        });

        this.distance = -1 * first * this.itemWidth;
        this.inTransition = true;
        this.currentTransform = 'translate3d(' + this.distance + '%,0,0)';
        this.track.style.transition = null;
        this.track.style.transform = this.currentTransform;
        if (this.settings.autoHeight) {
            this.track.style.height = maxHeight + "px";
        }

        clearTimeout(this.durationTimeout);
        this.durationTimeout = setTimeout(function () {
            _this.items[_this.current].classList.add(_this.settings.currentClass);
            _this.inTransition = false;
            if (_this.settings.autoplay > 0 && _this.current < _this.count - 1) {
                _this.play();
            }
            _this.track.removeEventListener('click', clickHandler);
            _this.track.classList.remove(_this.settings.movingClass);
            if (_this.current !== _this.prev) {
                var event = document.createEvent('Event');
                event.initEvent('change', true, true);
                _this.slider.dispatchEvent(event);
                _this.prev = _this.current;
            }
        }, this.duration);

        return this;
    }

    xSlider.prototype.goToPrev = function () {
        return this.goTo(this.current - this.settings.perSlide);
    }
    xSlider.prototype.goToNext = function () {
        return this.goTo(this.current + this.settings.perSlide);
    }
    xSlider.prototype.goToFirst = function () {
        return this.goTo(0);
    }
    xSlider.prototype.goToLast = function () {
        return this.goTo(this.count - 1);
    }
    xSlider.prototype.pause = function () {
        clearInterval(this.autoplayInterval);
        this.canPlay = false;
        return this;
    }
    xSlider.prototype.play = function () {
        var _this = this;
        if (this.settings.autoplay > 0 && this.canPlay && this.current < this.count - 1) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = setInterval(function () {
                if (!_this.settings.loop && _this.current == _this.count - 1) {
                    _this.pause();
                    _this.canPlay = true;
                    return _this;
                }
                _this.goToNext();
            }, this.settings.autoplay);
        }
        return this;
    }

    xSlider.prototype.mount = function () {
        this.recalc();
        var _this = this;

        window.addEventListener('resize', function () {
            clearTimeout(_this.resizeTimer);
            _this.resizeTimer = setTimeout(function () {
                _this.recalc();
                _this.reposition();
            }, 250);
        });

        if (this.settings.autoplay > 0 && this.settings.pauseOnHover) {
            this.viewport.addEventListener('mouseenter', function (e) {
                _this.pause();
            });
            this.viewport.addEventListener('mouseleave', function (e) {
                _this.canPlay = true;
                _this.play();
            });
        }

        function dragSwipeHandler (e, type) {
            e.stopPropagation();
            if (!_this.isMoving || !_this.xDown || !_this.yDown) {
                return;
            }
            _this.track.classList.add(_this.settings.movingClass);
            _this.xUp = type == 'drag' ? e.clientX : e.touches[0].clientX;
            _this.yUp = type == 'drag' ? e.clientY : e.touches[0].clientY;
            if (_this.xDown > _this.xUp) {
                _this.moveDirection = 'next';
            } else {
                _this.moveDirection = 'prev';
            }
            _this.xDiff = _this.xDown - _this.xUp;
            _this.yDiff = _this.yDown - _this.yUp;
            if (Math.abs(_this.xDiff) > Math.abs(_this.yDiff)) {
                var transform = 'translate3d(' + (_this.xDiff * -1) + 'px,0,0)';
                var canMove = true;
                if (!_this.settings.loop) {
                    if (_this.current == _this.count - 1 && _this.xDiff > 0) {
                        canMove = false;
                    } else if (_this.current == 0 && _this.xDiff < 0) {
                        canMove = false;
                    }
                }
                if (canMove) {
                    _this.track.style.transition = 'none';
                    _this.track.style.transform = _this.currentTransform + ' ' + transform;
                }
            }
            _this.track.addEventListener('click', clickHandler);
        }

        function dragSwipeEndHandler (e, type) {
            e.stopPropagation();
            var diff = Math.abs(_this.xDiff);
            if (diff > _this.settings.threshold) {
                if (_this.settings.moveToFirst) {
                    var vRect = _this.viewport.getBoundingClientRect();
                    var tRect = _this.track.getBoundingClientRect();
                    var left = tRect.left - vRect.left;
                    var moveTo = -1;
                    [].forEach.call(_this.items, function (item) {
                        var index = [].indexOf.call(_this.items, item);
                        if (item.offsetLeft < (left * -1)) {
                            var nextItem = _this.items[index + 1];
                            if (nextItem && nextItem.offsetLeft > (left * -1)) {
                                moveTo = _this.moveDirection == 'prev' ? index : index + 1;
                            } else if (!nextItem) {
                                moveTo = index;
                            }
                        }
                    });
                }
                if (moveTo > -1) {
                    _this.goTo(moveTo);
                } else if (moveTo === -1) {
                    _this.goToFirst();
                } else if (diff > 0) {
                    _this.goToNext();
                } else {
                    _this.goToPrev();
                }
            } else {
                _this.reposition();
            }
            _this.xDown = 0;
            _this.yDown = 0;
            _this.xDiff = 0;
            _this.yDiff = 0;
            _this.track.removeEventListener('mousemove', dragHandler, false);
            _this.track.removeEventListener('touchmove', swipeHandler, false);
            _this.isMoving = false;
        }

        function dragLeaveHandler (e) {
            if (_this.isMoving) {
                _this.reposition();
                _this.xDown = 0;
                _this.yDown = 0;
                _this.track.removeEventListener('mousemove', dragHandler, false);
                _this.track.removeEventListener('touchmove', swipeHandler, false);
                _this.track.removeEventListener('click', clickHandler);
                _this.isMoving = false;
            }
        }

        function dragEndHandler (e) {
            return dragSwipeEndHandler(e, 'drag');
        }

        function swipeEndHandler (e) {
            return dragSwipeEndHandler(e, 'swipe');
        }

        function dragHandler (e) {
            return dragSwipeHandler(e, 'drag');
        }

        function swipeHandler (e) {
            return dragSwipeHandler(e, 'swipe');
        }

        this.track.addEventListener('mousedown', function (e) {
            e.preventDefault();
            e.stopPropagation();
            _this.xDown = e.clientX;
            _this.yDown = e.clientY;
            _this.isMoving = true;
            _this.track.addEventListener('mousemove', dragHandler, false);
            _this.track.addEventListener('mouseup', dragEndHandler, false);
            _this.track.addEventListener('mouseleave', dragLeaveHandler, false);
        });

        this.track.addEventListener('touchstart', function (e) {
            e.preventDefault();
            e.stopPropagation();
            _this.xDown = e.touches[0].clientX;
            _this.yDown = e.touches[0].clientY;
            _this.isMoving = true;
            _this.track.addEventListener('touchmove', swipeHandler, false);
            _this.track.addEventListener('touchend', swipeEndHandler, false);
        });

        this.prevButtons.forEach(function (item) { item.addEventListener('click', function () { _this.goToPrev(); }) });
        this.nextButtons.forEach(function (item) { item.addEventListener('click', function () { _this.goToNext(); }) });
        this.firstButtons.forEach(function (item) { item.addEventListener('click', function () { _this.goToFirst(); }) });
        this.lastButtons.forEach(function (item) { item.addEventListener('click', function () { _this.goToLast(); }) });

        this.goTo(this.settings.startAt);
        this.play();

        var event = document.createEvent('Event');
        event.initEvent('mount', true, true);
        this.slider.dispatchEvent(event);
    }

}());