<?php
use PHPMailer\PHPMailer\PHPMailer;

/* Load composer's autoloader */
require_once "./libs/autoload.php";

/* Dummy translate function */
if (!function_exists("__")) {
    function __($data) {
        return $data;
    }
}

setlocale(LC_ALL, __("ru_RU") . ".UTF-8"); //locale

if (!defined('DEBUG'))
    define('DEBUG', isset($config) ? $config->debug : $_SERVER['REMOTE_ADDR'] == '127.0.0.1');
if (!defined('EMAIL'))
    define('EMAIL', isset($contacts) ? $contacts->email : null);
if (!defined('SITENAME'))
    define('SITENAME', isset($config->seo->sitename) ? $config->seo->sitename : $_SERVER["HTTP_HOST"]);

error_reporting(DEBUG ? E_ALL : 0);
ini_set("display_errors", DEBUG);

/* Localize Time */
if (!function_exists("localizeTime")) {
    function localizeTime($time = null, $pattern = "%e %B %Y") {
        $replacements = array(
            "Январь" => "января",
            "Февраль" => "февраля",
            "Март" => "марта",
            "Апрель" => "апреля",
            "Май" => "мая",
            "Июнь" => "июня",
            "Июль" => "июля",
            "Август" => "августа",
            "Сентябрь" => "сентября",
            "Октябрь" => "октября",
            "Ноябрь" => "ноября",
            "Декабрь" => "декабря",
        );
        return strtr(strftime($pattern, $time), $replacements);
    }
}

/* Remove unnecessary characters from phone number*/
if (!function_exists("prepareTel")) {
    function prepareTel($tel) {
        return preg_replace("/[^0-9\+]/", "", $tel);
    }
}

/* Prepare embed link */
if (!function_exists("prepareEmbedLink")) {
    function prepareEmbedLink($link) {
        $url = parse_url($link);
        if (strpos($url['host'], 'youtu') === false) {
            return $link;
        }
        // handle youtube links
        preg_match('%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/ ]{11})%i', $link, $match);
        if (count($match)) {
            $youtubeId = $match[1];
        } else {
            return $link;
        }
        $query = [];
        $paramsExist = [];
        if (isset($url['query'])) {
            $params = explode('&', $url['query']);
            foreach ($params as $param) {
                if (strpos($param, 'v=') === 0) {
                    continue;
                } elseif (strpos($param, 'vi=') === 0) {
                    continue;
                } elseif (strpos($param, 't=') === 0) {
                    $time = substr($param, 2);
                    preg_match('/(?:([\d]{1,2})h)*(?:([\d]{1,2})m)*(?:([\d]{1,2})s)*/i', $time, $tMatch);
                    $h = $m = $s = 0;
                    if (isset($tMatch[1])) $h = $tMatch[1];
                    if (isset($tMatch[2])) $m = $tMatch[2];
                    if (isset($tMatch[3])) $s = $tMatch[3];
                    $timeSeconds = $h * 3600 + $m * 60 + $s;
                    $param = 'start=' . $timeSeconds;
                } elseif (strpos($param, 'autoplay=') === 0) {
                    $paramsExist[] = 'autoplay';
                } elseif (strpos($param, 'rel=') === 0) {
                    $paramsExist[] = 'rel';
                } elseif (strpos($param, 'showinfo=') === 0) {
                    $paramsExist[] = 'showinfo';
                }
                $query[] = $param;
            }
        }
        if (!in_array('autoplay', $paramsExist)) {
            $query[] = 'autoplay=1';
        }
        if (!in_array('rel', $paramsExist)) {
            $query[] = 'rel=0';
        }
        if (!in_array('showinfo', $paramsExist)) {
            $query[] = 'showinfo=0';
        }

        return 'https://www.youtube.com/embed/' . $youtubeId . '?' . implode('&', $query);
    }
}

/* Render template */
if (!function_exists("render")) {
    function render($file, $params = null) {
        ob_start();
        if (!empty($params)) {
            extract($params, EXTR_SKIP);
        }
        include($file);
        return ob_get_clean();
    }
}

/* Pluralize */
if (!function_exists("pluralize")) {
    function pluralize($value, $t1, $t2, $tn) {
        $last = substr($value, -1);
        if ($last == 1) {
            return $t1;
        }
        if (in_array($last, array(2,3,4))) {
            return $t2;
        }
        if (in_array($last, array(0,5,6,7,8,9))) {
            return $tn;
        }
    }
}

if (!function_exists("sendEmail")) {
    function sendEmail($email, $message_body, $subject = "", $reply_to = "", $files = array()) {
        $host = $_SERVER["HTTP_HOST"];
        $host_no_www = str_replace("www.", "", $host);
        $sitename = SITENAME;
        $from = "{$sitename} <noreply@{$host_no_www}>";

        if (empty($subject)) {
          $subject = "Сообщение с сайта {$sitename}";
        }

        $message = render("./_mail.php", array(
            "host" => $host,
            "sitename" => $sitename,
            "subject" => $subject,
            "body" => $message_body
        ));

        $mail = new PHPMailer(DEBUG);
        $mail->CharSet = 'UTF-8';
        $mail->setFrom("noreply@{$host_no_www}", $sitename);
        $mail->Subject = $subject;
        $mail->isHTML(true);
        $mail->Body = $message;
        if (!is_array($email)) {
            $email = array($email);
        }
        foreach ($email as $eml) {
            $mail->addBCC($eml);
        }
        if (!empty($reply_to)) {
            $mail->addReplyTo($reply_to);
        }

        if (!empty($files)) {
            foreach ((array)$files as $fileName => $fileData) {
                $mail->addStringAttachment($fileData, $fileName);
            }
        }

        $result = $mail->send();

        return $result;
    }
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
                    $fields[$key]["error"] = sprintf(__("Поле \"%s\" должно быть корректным номером телефона в формате +7NNNNNNNNNN"), $label);
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
        foreach ($fields as $field) {
            if (!empty($field["error"]))
                $errors[] = $field["error"];
        }

        return $errors;
    }
}

/* Process form files */
if (!function_exists("processFiles")) {
    function processFiles($mimes = false) {
        if (!$mimes) {
            $mimes = array(
                "image/jpeg", // jpg jpeg
                "image/png", // png
                "image/vnd.dwg", // dwg
                "application/msword", // doc
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
                "application/vnd.ms-excel", // xls
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
                "application/pdf" // pdf
            );
        }

        if (isset($_POST["files"])) {
            $files = array();
            $errors = array();

            $pFiles = json_decode($_POST["files"], true);

            foreach ($pFiles as $i => $iFiles) {
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
                            $errors[] = sprintf(__("Недопустимый формат файла \"%s\""), $fileName);
                            continue;
                        }

                        $files[$fileName] = $fileData;
                    }
                }
            }

            return array("errors" => $errors, "files" => $files);
        }
    }
}

/* Process form */
if (!function_exists("processForm")) {
    function processForm($forms) {
        // check for form
        $pform = $_POST['form'];
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
            $fields[] = array("label" => $field["label"], "value" => $value, "params" => $field["rules"]);
        }

        // validating fields
        $fields = processFields($fields);
        $errors = processErrors($fields);

        // processing files
        $files = processFiles();
        if (isset($files["errors"])) {
            foreach ($files["errors"] as $fError) {
                $errors[] = $fError;
            }
        }
        $files = $files["files"];

        // if errors - returning erors
        if (!empty($errors))
            return json_encode(array("success" => "", "errors" => $errors));

        // processing message params
        $messageBody = "<strong>Время отправки:</strong> " . date("d.m.Y H:i:s", time());
        foreach ($fields as $field) {
            $messageBody .= "<br><strong>{$field['label']}:</strong> {$field['value']}";
        }

        $send = sendEmail($form["email_address"], $messageBody, $form["email_subject"], $email, $files);

        if ($send === true) {
            return json_encode(array("success" => $form["success"], "errors" => array()));
        } else {
            return json_encode(array("success" => "", "errors" => array($form["error"])));
        }
    }
}

if (!function_exists("isAjax")) {
    function isAjax() {
        return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
    }
}

/* Forms */
$forms = array(

    "feedback" => array(
        "fields" => array(

            "name" => array("label" => __("Ваше имя"), "rules" => "required|strip_tags"),
            "phone" => array("label" => __("Номер телефона"), "rules" => "phone|clear_phone|strip_tags"),
            "email" => array("label" => __("E-mail"), "rules" => "required|email|strip_tags"),
            "message" => array("label" => __("Сообщение"), "rules" => "required|strip_tags|nl2br"),

        ),
        "submit" => array("label" => __("Отправить")),
        "success" => __("Спасибо за обращение! Мы свяжемся с Вами в ближайшее время."),
        "error" => __("Ошибка отправки сообщения"),
        "email_subject" => "Сообщение с сайта " . SITENAME,
        "email_address" => EMAIL,
    ),

);

if (isset($_POST["form"])) {
    if (!isAjax()) return;
    echo processForm($forms);
    exit;
}

if (isset($_GET["data"])) {
    if (!isAjax()) return;
    $data = $_GET["data"];
    if (empty($data)) return;
    $start = isset($_GET["start"]) ? intval($_GET["start"]) : 0;
    $params = isset($_GET["params"]) ? $_GET["params"] : false;
    if (isset($params["limit"])) {
        $limit = intval($params["limit"]) > 48 ? 48 : intval($params["limit"]);
    } else {
        $limit = 12;
    }
    $html = "";

/*
    if ($data == "posts") {
        $all = array(); // all items
        $items = array(); // filtered items

        if (count($all)) {
            foreach ($items as $item) {
                $html .= render("./_post.php", array(
                    "item" => $item
                ));
            }
        } else {
            $html = render("./_empty-result.php");
        }
    }
*/

    echo json_encode(array(
        "last" => $start + $limit >= count($all),
        "html" => $html,
    ));
    exit;
}