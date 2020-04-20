(function() {

  this.xForm = function (elem, options) {
    this.settings = {
      submittingClass: 'xform--submitting',
      fieldClass: 'xform__field',
      fieldActivatedClass: 'xform__field--activated',
      inputClass: 'xform__input',
      fileClass: 'xform__file',
      fileValueClass: 'xform__file-value',
      fileValueActivatedClass: 'xform__file-value--activated',
      fileButtonClass: 'xform__file-button',
      errorClass: 'xform__error',
      securityClass: 'xform__security',
      resetOnSuccess: true,
      filePlaceholderText: '...',
      fileButtonText: '...',
      action: null,
    };
    for (var attrname in options) {
      this.settings[attrname] = options[attrname];
    }

    if (this.settings.action == null) {
      this.settings.action = location.pathname;
    }

    this.form = elem;
    this.fields = this.form.querySelectorAll('.' + this.settings.fieldClass);
    this.inputs = this.form.querySelectorAll('.' + this.settings.inputClass);
    this.files = this.form.querySelectorAll('input[type=file]');
    this.submitButtons = this.form.querySelectorAll('button[type=submit]');

    this.fileApi = (window.File && window.FileReader && window.FileList && window.Blob) ? true : false;

    for (var attrname in this.settings) {
      if (this.form.dataset[attrname] !== undefined) {
        this.settings[attrname] = this.form.dataset[attrname];
      }
    }

    elem.xForm = this;
  }

  xForm.prototype.toggleEvent = function (name) {
    var event = document.createEvent('Event');
    event.initEvent(name, true, true);
    this.form.dispatchEvent(event);
  }

  xForm.prototype._inputChange = function (e) {
    var input = e.target;
    var field = input.closest('.' + this.settings.fieldClass);
    if (input.value !== '' && !field.classList.contains(this.settings.fieldActivatedClass)) {
      field.classList.add(this.settings.fieldActivatedClass);
    } else if (input.value == '' && field.classList.contains(this.settings.fieldActivatedClass)) {
      field.classList.remove(this.settings.fieldActivatedClass);
    }
  }

  xForm.prototype._fileChange = function (e) {
    var fileInput = e.target;
    var fileWrapper = fileInput.closest('.' + this.settings.fileClass);
    var fileValue = fileWrapper.querySelector('.' + this.settings.fileValueClass);
    var fileButton = fileWrapper.querySelector('.' + this.settings.fileButtonClass);
    var field = fileInput.closest('.' + this.settings.fieldClass);
    var fileName;
    if (this.fileApi && fileInput.files.length) {
      var files = fileInput.files;
      var fileNames = [];
      for (var i = 0; i < files.length; i++) {
        fileNames.push(fileInput.files[i].name);
      }
      fileName = fileNames.join(', ');
    } else {
      fileName = fileInput.value.replace('C:\\fakepath\\', '');
    }
    if (!fileName.length) {
      fileValue.innerText = this.filePlaceholderText;
      fileValue.classList.remove(this.settings.fileValueActivatedClass);
      field.classList.remove(this.settings.fieldActivatedClass);
      return;
    }
    if (!!( fileValue.offsetWidth || fileValue.offsetHeight || fileValue.getClientRects().length )) {
      fileValue.innerText = fileName;
      fileValue.classList.add(this.settings.fileValueActivatedClass);
      field.classList.add(this.settings.fieldActivatedClass);
      fileButton.innerText = this.settings.fileButtonText;
    } else {
      fileButton.innerText = fileName;
    }
  }

  xForm.prototype.reset = function () {
    this.form.reset();
    this.inputs.forEach(function (input) {
      input.dispatchEvent(new Event('blur'));
    });
    this.files.forEach(function (fileInput) {
      fileInput.dispatchEvent(new Event('change'));
    });
  }

  xForm.prototype.submit = function () {
    return this._formSubmit();
  }

  xForm.prototype._formSubmit = function (e) {
    if (e) {
      e.preventDefault();
    }
    var _this = this;
    var xform = this.form.querySelector('[name=xform]');
    if (!xform) {
      console.error('[xForm] input[name="xform"] not found');
    }

    var securityInput = document.createElement('input');
    securityInput.classList.add(this.settings.securityClass);
    securityInput.type = 'hidden';
    securityInput.name = 'security';
    securityInput.value = '1';
    this.form.appendChild(securityInput);

    this.submitButtons.forEach(function (button) {
      button.disabled = true;
    });

    this.toggleEvent('beforesubmit');
    this.form.classList.add(this.settings.submittingClass);

    var readFiles = function (callback) {
      if (!_this.fileApi) return null;
      var rfiles = {};
      var filesCount = 0;
      var filesReaded = 0;
      _this.files.forEach(function (fileInput) {
        var files = fileInput.files;
        var curName = fileInput.name;
        rfiles[curName] = [];
        for (var i = 0; i < files.length; i++) {
          filesCount++;
          var file = files[i];
          var reader = new FileReader();
          reader.file = {};
          reader.file.name = file.name;
          reader.file.type = file.type;
          reader.file.size = file.size;
          reader.readAsDataURL(file);
          reader.onload = function (event) {
            rfiles[curName].push({
              name: event.target.file.name,
              type: event.target.file.type,
              size: event.target.file.size,
              data: event.target.result
            });
            filesReaded++;
            if (filesReaded >= filesCount && typeof callback == 'function') {
              callback(rfiles);
            }
          };
        }
      });
      if (filesCount == 0 && typeof callback == 'function') {
        callback();
      }
    }

    var sendForm = function () {
      var errored = _this.form.querySelectorAll('.' + _this.settings.errorClass);
      errored.forEach(function (err) {
        err.remove();
      });

      var xhr = new XMLHttpRequest();
      xhr.open('post', _this.settings.action);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.responseType = 'json';

      xhr.onload = function () {
        var data = xhr.response;
        var error = data['error'];
        var errors = data['errors'];
        var hasErrors = (error && error.length) || (errors && Object.keys(errors).length > 0);
        if (hasErrors) {
          if (alertify && error && error.length) {
            alertify.error(error);
          }
          if (errors && Object.keys(errors).length > 0) {
            for (var field in errors) {
              if (errors.hasOwnProperty(field)) {
                var input = _this.form.querySelector('[name=' + field + ']');
                if (input) {
                  errors[field].forEach(function (err) {
                    var errElem = document.createElement('div');
                    errElem.classList.add(_this.settings.errorClass);
                    errElem.innerText = err;
                    input.closest('.' + _this.settings.fieldClass).appendChild(errElem);
                  });
                }
              }
            }
            var fieldElem;
            var errElem = _this.form.querySelector('.' + _this.settings.errorClass);
            if (errElem) {
              fieldElem = errElem.closest('.' + _this.settings.fieldClass);
            }
            if (fieldElem) {
              var fieldOffsetTop = getElementOffset(fieldElem).top;
              var scrollTop = fieldOffsetTop;
              var scrollContainer = document.scrollingElement || document.documentElement;
              var wrap = fieldElem.closest('.mfp-wrap');
              if (wrap) {
                var baseScrollTop = scrollContainer.scrollTop;
                scrollContainer = wrap;
                scrollTop = scrollContainer.scrollTop + fieldOffsetTop - baseScrollTop;
              }
              animatedScrollTo(scrollContainer, scrollTop, 300);
            }
          }
          _this.toggleEvent('error');
        } else {
          var success = data['success'];
          if (_this.settings.resetOnSuccess) {
            _this.reset();
          }
          if (alertify && success) {
            alertify.success(success);
          }
          _this.toggleEvent('success');
        }
      }

      xhr.onloadend = function () {
        if (securityInput) {
          securityInput.remove();
        }
        _this.submitButtons.forEach(function (button) {
          button.disabled = false;
        });
        _this.form.classList.remove(_this.settings.submittingClass);
        _this.toggleEvent('complete');
      }

      xhr.onerror = function () {
        _this.toggleEvent('error');
      }

      xhr.send(formData);
    }

    var formData = new FormData(this.form);

    readFiles(function (files) {
      if (files !== undefined) {
        formData.append('files', JSON.stringify(files));
      }
      sendForm();
    });

    return false;
  }

  xForm.prototype.mount = function () {
    var _this = this;
    this._inputChangeHandler = _this._inputChange.bind(_this);
    this._fileChangeHandler = _this._fileChange.bind(_this);
    this.inputs.forEach(function (input) {
      input.addEventListener('change', _this._inputChangeHandler);
      input.addEventListener('input', _this._inputChangeHandler);
      input.addEventListener('blur', _this._inputChangeHandler);
      input.dispatchEvent(new Event('change'));
    });

    /* File inputs */
    this.files.forEach(function (fileInput) {

      var fileWrapper = document.createElement('div');
      fileWrapper.classList.add(_this.settings.fileClass);
      fileInput.parentNode.insertBefore(fileWrapper, fileInput);

      var fileValue = document.createElement('span');
      fileValue.classList.add(_this.settings.fileValueClass);
      fileValue.innerText = _this.settings.filePlaceholderText;
      fileWrapper.appendChild(fileValue);

      var fileButton = document.createElement('span');
      fileButton.classList.add(_this.settings.fileButtonClass);
      fileButton.innerText = _this.settings.fileButtonText;
      fileWrapper.appendChild(fileButton);

      fileWrapper.appendChild(fileInput);

      fileInput.addEventListener('change', _this._fileChangeHandler);
      fileInput.dispatchEvent(new Event('change'));
    });

    this._formSubmitHandler = _this._formSubmit.bind(_this);
    this.form.addEventListener('submit', _this._formSubmitHandler);
    this.toggleEvent('mount');
  }

  xForm.prototype.unmount = function () {
    var _this = this;
    this.inputs.forEach(function (input) {
      input.removeEventListener('change', _this._inputChangeHandler);
      input.removeEventListener('input', _this._inputChangeHandler);
      input.removeEventListener('blur', _this._inputChangeHandler);
    });
    this.files.forEach(function (fileInput) {
      fileInput.removeEventListener('change', _this._fileChangeHandler);
      var fileWrapper = fileInput.closest('.' + _this.settings.fileClass);
      var initialParent = fileInput.parentNode.parentNode;
      initialParent.appendChild(fileInput);
      fileWrapper.remove();
    });
    this.fields.forEach(function (field) {
      field.classList.remove(_this.settings.fieldActivatedClass);
    });
    this.form.removeEventListener('submit', _this._formSubmitHandler);
  }

  xForm.prototype.destroy = function () {
    this.unmount();
    delete(this.form.xForm);
  }

}());