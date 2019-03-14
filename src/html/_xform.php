<?php

if (!defined('MIMES')) {
    define('MIMES', array(
        "image/jpeg", // jpg jpeg
        "image/png", // png
        "image/vnd.dwg", // dwg
        "application/msword", // doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
        "application/excel", // xls
        "application/vnd.ms-excel", // xls
        "application/x-excel", // xls
        "application/x-msexcel", // xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
        "application/pdf" // pdf
    ));
}

if (!function_exists("processFields")) {
    function processFields($fields) {
        foreach ($fields as $key => $field) {
            $params = explode("|", str_replace(" ", "", $field["params"]));

            $label = trim($field["label"]);
            $value = trim($field["value"]);
            $ivalue = intval($value);

            if (!empty($params)) {
                if (in_array("required", $params) && empty($value)) {
                    $fields[$key]["error"] = sprintf(__("Поле \"%s\" обязательно для заполнения"), $label);
                    continue;
                }
                if (in_array("email", $params) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $fields[$key]["error"] = sprintf(__("Поле \"%s\" должно содержать Ваш реальный E-mail адрес"), $label);
                    continue;
                }
                if (in_array("number", $params) && empty($ivalue)) {
                    $fields[$key]["error"] = sprintf(__("Поле \"%s\" должно быть числом"), $label);
                    continue;
                }
                if (in_array("phone", $params) && preg_match("/\+\d{11,14}/", $value) !== 1 && !empty($value)) {
                    $fields[$key]["error"] = sprintf(__("Поле \"%s\" должно быть корректным номером телефона в международном формате (+NNNNNNNNNNN)"), $label);
                    continue;
                }
                if (in_array("strip_tags", $params)) {
                    $value = strip_tags($value);
                }
                if (in_array("nl2br", $params)) {
                    $value = nl2br($value);
                }
                if (in_array("clear_phone", $params)) {
                    $value = preg_replace("/[^\+0-9]/", "", $value);
                }

                $fields[$key]["value"] = $value;
            }
        }

        return $fields;
    }
}

/* Process form errors */
if (!function_exists("processErrors")) {
    function processErrors($fields) {
        $errors = array();
        foreach ($fields as $fieldName => $field) {
            if (!empty($field["error"])) {
                $errors[$fieldName][] = $field["error"];
            }
        }

        return $errors;
    }
}

/* Process form files */
if (!function_exists("processFiles")) {
    function processFiles($mimes = false) {
        if (!$mimes) {
            $mimes = MIMES;
        }

        $files = array();
        $errors = array();

        if (isset($_POST["files"])) {
            $pFiles = json_decode($_POST["files"], true);

            foreach ($pFiles as $fieldName => $iFiles) {
                if (!empty($iFiles)) {
                    foreach ($iFiles as $file) {
                        $fileName = $file["name"];

                        $fileData = explode(',', $file["data"]);
                        $encData = end($fileData);
                        $encData = str_replace(' ', '+', $encData);
                        $fileData = base64_decode($encData);

                        $fileInfo = finfo_open();
                        $mimeType = finfo_buffer($fileInfo, $fileData, FILEINFO_MIME_TYPE);

                        if (!in_array($mimeType, $mimes)) {
                            $errors[$fieldName][] = sprintf(__("Недопустимый формат файла \"%s\""), $fileName);
                            continue;
                        }

                        if (!isset($files[$fieldName])) {
                            $files[$fieldName] = array();
                        }

                        $files[$fieldName][$fileName] = $fileData;
                    }
                }
            }
        }

        return array("errors" => $errors, "files" => $files);
    }
}

if (!function_exists("formErrors")) {
    function formErrors($errors = array(), $error = null) {
        if (!is_array($errors)) {
            $errors = [$errors];
        }
        return json_encode(array("success" => "", "errors" => $errors, "error" => $error));
    }
}

if (!function_exists("formSuccess")) {
    function formSuccess($success = null) {
        return json_encode(array("success" => $success, "errors" => array(), "error" => ""));
    }
}

/* Process form */
if (!function_exists("processForm")) {
    function processForm($forms) {
        // check for form
        $pform = $_POST['xform'];
        if (empty($pform)) return;

        // check for security
        $security = $_POST['security'];
        if (empty($security)) return;

        // getting form
        $form = $forms[$pform];

        // getting fields
        $email = false;
        $fields = array();
        foreach ($form["fields"] as $fieldName => $field) {
            $value = null;
            if (isset($_POST[$fieldName]))
                $value = $_POST[$fieldName];
            if ($fieldName == "email")
                $email = $value;
            $fields[$fieldName] = array("label" => $field["label"], "value" => $value, "params" => $field["rules"]);
        }

        // validating fields
        $fields = processFields($fields);
        $errors = processErrors($fields);

        // processing files
        $files = processFiles();
        if (isset($files["files"])) {
            $cFiles = $files["files"];
            foreach ($form["files"] as $fieldName => $field) {
                if (!empty($field["required"]) && !isset($cFiles[$fieldName])) {
                    if (!isset($errors[$fieldName])) {
                        $errors[$fieldName] = array();
                    }
                    $errors[$fieldName][] = sprintf(__("Поле \"%s\" обязательно для заполнения"), $field["label"]);
                }
            }
        }
        if (isset($files["errors"])) {
            foreach ($files["errors"] as $fieldName => $fErrors) {
                $errors[$fieldName] = $fErrors;
            }
        }
        $files = $files["files"];

        // if errors - returning errors
        if (!empty($errors)) {
            return formErrors($errors, __("Не все данные прошли проверку"));
        }

        // processing callback
        if (!empty($form["callback"]) && is_object($form["callback"]) && $form["callback"] instanceof \Closure) {
            return $form["callback"]($fields, $files, $form);
        }

        // processing message params
        $messageBody = "<strong>Время отправки:</strong> " . date("d.m.Y H:i:s", time());
        foreach ($fields as $field) {
            $messageBody .= "<br><strong>{$field['label']}:</strong> {$field['value']}";
        }

        $sendFiles = array();
        if (count($files)) {
            foreach ($files as $fieldName => $fieldFiles) {
                $sendFiles = array_merge($sendFiles, $fieldFiles);
            }
        }

        $send = sendEmail($form["email_address"], $messageBody, $form["email_subject"], $email, $sendFiles);

        if ($send === true) {
            return formSuccess($form["success"]);
        } else {
            return formErrors($errors, $form["error"]);
        }
    }
}

if (!function_exists("prepareFieldParams")) {
    function prepareFieldParams($fieldType, $params) {
        if (isset($params["params"])) {
            unset($params["params"]);
        }
        if (!isset($params["id"])) {
            $params["id"] = $fieldType . '-' . uniqid();
        }
        if (!isset($params["label"])) {
            $params["label"] = '';
        }
        if (!isset($params["hint"])) {
            $params["hint"] = '';
        }
        if (!isset($params["required"])) {
            $params["required"] = false;
        }
        if (!isset($params["value"])) {
            $params["value"] = '';
        }

        return $params;
    }
}

if (!function_exists("renderBase")) {
    function renderBase($fieldType, $params) {
        $fName = 'renderBase' . ucfirst($fieldType);
        return call_user_func($fName, $params);
    }
}

if (!function_exists("renderLabel")) {
    function renderLabel($label = '', $for = '') {
        return '<label class="xform__label" for="' . $for . '">' . $label . '</label>';
    }
}

if (!function_exists("renderHint")) {
    function renderHint($hint = '') {
        return '<label class="xform__hint">' . $hint . '</label>';
    }
}

if (!function_exists("renderHidden")) {
    function renderHidden($params) {
        $params = prepareFieldParams('hidden', $params);
        extract($params);

        return '<input id="' . $id . '" name="' . $name . '" type="hidden" value="' . $value . '">';
    }
}

if (!function_exists("renderField")) {
    function renderField($fieldType, $params) {
        $params = prepareFieldParams($fieldType, $params);
        extract($params);

        $html = '<div class="xform__field' . ($required ? ' xform__field--required' : '') . '">';
        if (!empty($name)) {
            $html .= renderBase($fieldType, $params);
        }
        if (!in_array($fieldType, ['checkbox', 'radio', 'checkboxes', 'radios']) && !empty($label)) {
            $html .= renderLabel($label, $id);
        }
        if (!empty($hint)) {
            $html .= renderHint($hint);
        }
        $html .= '</div>';

        return $html;
    }
}

if (!function_exists("renderBaseInput")) {
    function renderBaseInput($params) {
        $params = prepareFieldParams('input', $params);
        extract($params);

        $type = isset($type) ? $type : 'text';

        return '<input class="xform__input" id="' . $id . '" name="' . $name . '" type="' . $type . '" title="' . $label . '" value="' . $value . '"' . ($required ? ' required' : '') . '>';
    }
}

if (!function_exists("renderBaseFile")) {
    function renderBaseFile($params) {
        $params = prepareFieldParams('file', $params);
        extract($params);

        $multiple = isset($multiple) ? $multiple : false;

        return '<input id="' . $id . '" name="' . $name . '" type="file"' . ($multiple ? ' multiple' : '') . ($required ? ' required' : '') . '>';
    }

}

if (!function_exists("renderBaseTextarea")) {
    function renderBaseTextarea($params) {
        $params = prepareFieldParams('textarea', $params);
        extract($params);

        return '<textarea class="xform__input xform__input--text" name="' . $name .'" title="' . $label . '"' . ($required ? ' required' : '') . '>' . $value . '</textarea>';
    }

}

if (!function_exists("renderBaseSelect")) {
    function renderBaseSelect($params) {
        $params = prepareFieldParams('select', $params);
        extract($params);

        $options = isset($options) ? $options : [];

        $html = '<select class="xform__input xform__input--select" id="' . $id . '" name="' . $name . '" title="' . $label . '"' . ($required ? ' required' : '') . '><option value="" ' . ($value == '' ? ' selected' : '') . '>&nbsp;</option>';
        if ($options instanceof ProcessWire\Page) {
            foreach ($options->children as $option) {
                $html .= '<option value="' . $option->id . '" ' . ($value == $option->id ? ' selected' : '') . '>' . $option->title . '</option>';
            }
        } elseif (is_array($options)) {
            foreach ($options as $val => $title) {
                $html .= '<option value="' . $val . '" ' . ($value == $val ? ' selected' : '') . '>' . $title . '</option>';
            }
        }
        $html .= '</select>';
        return $html;
    }

}

if (!function_exists("renderBaseCheckbox")) {
    function renderBaseCheckbox($params) {
        $params = prepareFieldParams('checkbox', $params);
        extract($params);

        $checked = isset($checked) ? $checked : false;

        return '<input class="xform__checkbox" id="' . $id . '" type="checkbox" name="' . $name . '" value="' . $value . '"' . ($required ? ' required' : '') . ($checked ? ' checked' : '') . '><label for="' . $id . '">' . $label . '</label>';
    }

}

if (!function_exists("renderBaseRadio")) {
    function renderBaseRadio($params) {
        $params = prepareFieldParams('radio', $params);
        extract($params);

        $checked = isset($checked) ? $checked : false;

        return '<input class="xform__radio" id="' . $id . '" type="radio" name="' . $name . '" value="' . $value . '"' . ($required ? ' required' : '') . ($checked ? ' checked' : '') . '><label for="' . $id . '">' . $label . '</label>';
    }

}

if (!function_exists("renderBaseYear")) {
    function renderBaseYear($params) {
        $params = prepareFieldParams('year', $params);
        extract($params);

        $from = isset($from) ? $from : date('Y');
        $to = isset($to) ? $to : 1900;

        $years = [];
        if ($from >= $to) {
            for ($year = $from; $year >= $to; $year--) {
                $years[$year] = $year;
            }
        } elseif ($from < $to) {
            for ($year = $from; $year <= $to; $year++) {
                $years[$year] = $year;
            }
        }
        return renderBaseSelect(['name' => $name, 'options' => $years, 'label' => $label, 'required' => $required, 'value' => $value]);
    }

}

if (!function_exists("renderBaseCheckboxes")) {
    function renderBaseCheckboxes($params) {
        $params = prepareFieldParams('checkboxes', $params);
        extract($params);

        $values = isset($values) ? $values : [];
        $options = isset($options) ? $options : [];

        if (empty($values)) {
            $values = [];
        } elseif (!is_array($values)) {
            $values = [$values];
        }
        $html = '<fieldset class="xform__fieldset">';
        if (!empty($label)) {
            $html .= '<legend class="xform__legend">' . $label . '</legend>';
        }
        foreach ($options as $key => $title) {
            $html .= renderBaseCheckbox([
                'name' => $name . '[]',
                'value' => $key,
                'label' => $title,
                'required' => false,
                'checked' => in_array($key, $values)
            ]);
        }
        $html .= '</fieldset>';

        return $html;
    }
}

if (!function_exists("renderBaseRadios")) {
    function renderBaseRadios($params) {
        $params = prepareFieldParams('radios', $params);
        extract($params);

        $options = isset($options) ? $options : [];

        $html = '<fieldset class="xform__fieldset">';
        if (!empty($label)) {
            $html .= '<legend class="xform__legend">' . $label . '</legend>';
        }
        foreach ($options as $key => $title) {
            $html .= renderBaseRadio([
                'name' => $name,
                'value' => $key,
                'label' => $title,
                'required' => false,
                'checked' => $key == $value,
            ]);
        }
        $html .= '</fieldset>';

        return $html;
    }
}