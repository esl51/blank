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

                    var placeholderText = fileInput.data("placeholder") ? fileInput.data("placeholder") : "";
                    var buttonText = fileInput.data("button") ? fileInput.data("button") : "...";

                    fileInput.wrap($('<label class="' + settings.fileClass + '"/>'));
                    var fileWrapper = fileInput.parent();

                    fileWrapper.prepend('<span class="' + settings.fileButtonClass + '">' + buttonText + '</span>');
                    var fileButton = fileWrapper.children("." + settings.fileButtonClass);

                    fileWrapper.prepend('<span class="' + settings.fileValueClass + '">' + placeholderText + '</span>');
                    var fileValue = fileWrapper.children("." + settings.fileValueClass);

                    fileInput.change(function() {
                        var fileName;
                        if (fileApi && fileInput[0].files[0]) {
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
                            return;
                        }

                        if (fileValue.is(":visible")) {
                            fileValue.text(fileName);
                            fileValue.addClass(settings.fileValueActivatedClass);
                            fileButton.text(buttonText);
                        } else {
                            fileButton.text(fileName);
                        }
                    }).change();
                });

                /* Submit */
                form.on("submit", function() {
                    if (form.find('[name="form"]').length == 0) {
                        $.error('[xForm] input[name="form"] not found');
                    }
                    form.prepend('<input class="xform__security" type="hidden" name="security" value="1">');
                    form.find(":button[type=submit]").prop("disabled", true);

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
                        form.trigger("xform:beforeSubmit");
                        form.addClass("xform--submitting");
                        $.ajax({
                            type: 'post',
                            cache: false,
                            data: formData,
                            dataType: 'json',
                            success: function(data) {
                                //alertify.dismissAll();
                                var errors = data["errors"];
                                var errorsHtml = '<ul>';
                                if (errors.length > 0) {
                                    for (var i = 0; i < errors.length; i++) {
                                        alertify.error(errors[i], 0);
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

                    var formData = {};
                    form.serializeArray().map(function(x) {
                        formData[x.name] = x.value;
                    });

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