(function($) {

    var methods = {

        init: function(options) {

            var settings = $.extend({
                fieldClass: 'xform__field',
                fieldActivatedClass: 'xform__field--activated',
                inputClass: 'xform__input',
                fileClass: 'xform__file',
                fileValueClass: 'xform__file-value',
                fileValueActivatedClass: 'xform__file-value--activated',
                fileButtonClass: 'xform__file-button',
                errorClass: 'xform__error',
                resetOnSuccess: true,
            }, options);

            this.each(function() {

                /* Form */
                var form = $(this);

                /* Activated class */
                form.find("." + settings.inputClass).on("change input blur", function() {
                    var input = $(this);
                    var field = input.closest("." + settings.fieldClass);
                    if (input.val() !== "" && !field.hasClass(settings.fieldActivatedClass)) {
                        field.addClass(settings.fieldActivatedClass);
                    } else if (input.val() == "" && field.hasClass(settings.fieldActivatedClass)) {
                        field.removeClass(settings.fieldActivatedClass);
                    }
                }).change();

                /* File inputs */
                var fileApi = (window.File && window.FileReader && window.FileList && window.Blob) ? true : false;
                form.find(":file").each(function() {

                    var fileInput = $(this);

                    var placeholderText = "...";
                    var buttonText = "...";

                    fileInput.wrap($('<div class="' + settings.fileClass + '"/>'));
                    var fileWrapper = fileInput.parent();

                    fileWrapper.prepend('<span class="' + settings.fileButtonClass + '">' + buttonText + '</span>');
                    var fileButton = fileWrapper.children("." + settings.fileButtonClass);

                    fileWrapper.prepend('<span class="' + settings.fileValueClass + '">' + placeholderText + '</span>');
                    var fileValue = fileWrapper.children("." + settings.fileValueClass);

                    fileInput.change(function() {
                        var fileName;
                        if (fileApi && fileInput[0].files.length) {
                            var files = fileInput[0].files;
                            var fileNames = [];
                            for (var i = 0; i < files.length; i++) {
                                fileNames.push(fileInput[0].files[i].name);
                            }
                            fileName = fileNames.join(', ');
                        } else {
                            fileName = fileInput.val().replace("C:\\fakepath\\", '');
                        }

                        if (!fileName.length) {
                            fileValue.text(placeholderText);
                            fileValue.removeClass(settings.fileValueActivatedClass);
                            fileValue.closest("." + settings.fieldClass).removeClass(settings.fieldActivatedClass);
                            return;
                        }

                        if (fileValue.is(":visible")) {
                            fileValue.text(fileName);
                            fileValue.addClass(settings.fileValueActivatedClass);
                            fileValue.closest("." + settings.fieldClass).addClass(settings.fieldActivatedClass);
                            fileButton.text(buttonText);
                        } else {
                            fileButton.text(fileName);
                        }
                    }).change();
                });

                /* Submit */
                form.on("submit", function() {
                    if (form.find('[name="xform"]').length == 0) {
                        $.error('[xForm] input[name="xform"] not found');
                    }
                    form.prepend('<input class="xform__security" type="hidden" name="security" value="1">');
                    form.find(":button[type=submit]").prop("disabled", true);
                    form.trigger("xform:beforeSubmit");
                    form.addClass("xform--submitting");

                    var readFiles = function(callback) {
                        if (!fileApi) return null;
                        var fileInputs = form.find(":file");
                        var rfiles = {};
                        var filesCount = 0;
                        var filesReaded = 0;
                        fileInputs.each(function() {
                            var curInput = $(this);
                            var curFiles = curInput.get(0).files;
                            var curName = curInput.attr("name");
                            rfiles[curName] = [];
                            for (var i = 0; i < curFiles.length; i++) {
                                filesCount++;
                                var file = curFiles[i];
                                var reader = new FileReader();
                                reader.file = {};
                                reader.file.name = file.name;
                                reader.file.type = file.type;
                                reader.file.size = file.size;
                                reader.readAsDataURL(file);
                                reader.onload = function(event) {
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

                    var sendForm = function() {
                        form.find("." + settings.errorClass).remove();
                        $.ajax({
                            type: 'post',
                            cache: false,
                            data: formData,
                            dataType: 'json',
                            success: function(data) {
                                var error = data["error"];
                                var errors = data["errors"];
                                var hasErrors = (error && error.length) || (errors && Object.keys(errors).length > 0);
                                if (hasErrors) {
                                    if (error && error.length) {
                                        alertify.error(error);
                                    }
                                    if (errors && Object.keys(errors).length > 0) {
                                        for (var field in errors) {
                                            if (errors.hasOwnProperty(field)) {
                                                var input = form.find("[name=" + field + "]");
                                                if (input.length) {
                                                    errors[field].forEach(function (err) {
                                                        input.closest("." + settings.fieldClass).append('<div class="' + settings.errorClass + '">' + err + '</div>');
                                                    });
                                                }
                                            }
                                        }
                                        var elem = form.find("." + settings.errorClass).closest("." + settings.fieldClass);
                                        if (elem.length) {
                                            var elemOffset = elem.offset().top;
                                            var scrollTop = elemOffset;
                                            var wrap = elem.closest('.mfp-wrap');
                                            var scrollContainer = $('html, body');
                                            var baseScSt = scrollContainer.scrollTop();
                                            if (wrap.length) {
                                                scrollContainer = wrap;
                                                var scSt = scrollContainer.scrollTop();
                                                scrollTop = scSt + elemOffset - baseScSt;
                                            }
                                            scrollContainer.animate({
                                                scrollTop: scrollTop
                                            }, 300);
                                        }
                                    }
                                    form.trigger("xform:error");
                                } else {
                                    var success = data["success"];
                                    if (settings.resetOnSuccess) {
                                        methods.reset.apply(this, form);
                                    }
                                    if (success) {
                                        alertify.success(success);
                                    }
                                    form.trigger("xform:success");
                                }
                            },
                            complete: function(data) {
                                form.children(".xform__security").remove();
                                form.find(":button[type=submit]").prop("disabled", false);
                                form.removeClass("xform--submitting");
                                form.trigger("xform:complete");
                            }
                        });
                    }

                    var formData = form.serializeArray();

                    readFiles(function(files) {
                        if (files !== undefined) {
                            formData.files = JSON.stringify(files);
                        }
                        sendForm();
                    });

                    return false;
                }); /* submit */

            }); /* each */

        }, /* init */

        reset: function(form) {

            form = $(form);
            form.get(0).reset();
            form.find(":file").change();
            form.find(":input").blur();
            //alertify.dismissAll();

        } /* reset */

    } /* methods */

    $.fn.xForm = function(method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('[xForm] Method "' +  method + '" not found');
        }

    }

})(jQuery);