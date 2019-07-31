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
        $replacements = [
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
        ];
        return strtr(strftime($pattern, $time), $replacements);
    }
}

/* Include icon */
if (!function_exists("icon")) {
    function icon($name, $class = null/*, $width = null, $height = null*/) {
        $icon = file_get_contents(__DIR__ . "/icons/$name.svg");
        preg_match("/^<svg[^>]*viewBox\s*=\s*\"?([0-9\s]+)\"?[^>]*>/", $icon, $matchViewBox);
        if (!isset($matchViewBox[1])) {
            return "No viewBox attribute";
        }
        $dimensions = explode(" ", $matchViewBox[1]);
        if (count($dimensions) < 4) {
            return "Wrong viewBox attribute";
        }
        /*
        $dWidth = intval($dimensions[2]);
        $dHeight = intval($dimensions[3]);
        if ($dWidth <= 0 || $dHeight <= 0) {
            return "Wrong dimensions";
        }
        if (empty($width) && empty($height)) {
            $width = $dWidth;
            $height = $dHeight;
        }
        if (!empty($height)) {
            $icon = str_replace('<svg', '<svg height="' . $height . '"', $icon);
        }
        if (!empty($width)) {
            $icon = str_replace('<svg', '<svg width="' . $width . '"', $icon);
        }
        */
        $icon = '<span class="' . (!empty($class) ? $class . ' ' : '') . 'icon">' . $icon . '</span>';
        return $icon;
    }
}

/* Remove unnecessary characters from phone number*/
if (!function_exists("prepareTel")) {
    function prepareTel($tel) {
        $tel = preg_replace("/добавочный/i", ',', $tel);
        $tel = preg_replace("/доб\.?/i", ',', $tel);
        return preg_replace("/[^0-9\+\,]/", "", $tel);
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
        if (in_array($last, [2, 3, 4])) {
            return $t2;
        }
        if (in_array($last, [0, 5, 6, 7, 8, 9])) {
            return $tn;
        }
    }
}

if (!function_exists("sendEmail")) {
    function sendEmail($email, $message_body, $subject = "", $reply_to = "", $files = []) {
        $host = $_SERVER["HTTP_HOST"];
        $host_no_www = str_replace("www.", "", $host);
        $sitename = SITENAME;

        if (empty($subject)) {
          $subject = "Сообщение с сайта {$sitename}";
        }

        $message = render("./_mail.php", [
            "host" => $host,
            "sitename" => $sitename,
            "subject" => $subject,
            "body" => $message_body
        ]);

        $mail = new PHPMailer(DEBUG);
        $mail->CharSet = 'UTF-8';
        $mail->setFrom("noreply@{$host_no_www}", $sitename);
        $mail->Subject = $subject;
        $mail->isHTML(true);
        $mail->Body = $message;
        if (!is_array($email)) {
            $email = [$email];
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

if (!function_exists("isAjax")) {
    function isAjax() {
        return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
    }
}

include "./_xform.php";

/* xForms */
$xForms = [

    "feedback" => [
        "fields" => [
            "name" => ["label" => __("Ваше имя"), "rules" => "required|strip_tags"],
            "phone" => ["label" => __("Номер телефона"), "rules" => "phone|clear_phone|strip_tags"],
            "email" => ["label" => __("E-mail"), "rules" => "required|email|strip_tags"],
            "message" => ["label" => __("Сообщение"), "rules" => "required|strip_tags|nl2br"],
            "theme" => ["label" => __("Тема"), "rules" => "strip_tags|nl2br"],
        ],
        "files" => [
            "file1" => ["label" => __("Файл"), "required" => true, "mimes" => MIMES],
            "file2" => ["label" => __("Файлы"), "required" => false, "mimes" => MIMES],
        ],
        "callback" => function ($fields, $files, $form) {
            sleep(2);
            return formErrors([], __("Удалите callback из параметров формы, он приведён для примера."));
        },
        "submit" => ["label" => __("Отправить")],
        "success" => __("Спасибо за обращение! Мы свяжемся с Вами в ближайшее время."),
        "error" => __("Ошибка отправки сообщения"),
        "email_subject" => "Сообщение с сайта " . SITENAME,
        "email_address" => EMAIL,
    ],

];

if (isset($_POST["xform"])) {
    if (!isAjax()) return;
    echo processForm($xForms);
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
    $all = array_fill(0, 100, 1); // all items

    if ($data == "posts") {
        //$all = []; // all items
        $items = array_slice($all, $start, $limit); // filtered items

        if (count($all)) {
            foreach ($items as $item) {
                $html .= render("./_post.php", [
                    "item" => $item
                ]);
            }
        } else {
            $html = render("./_empty-result.php");
        }
    }
    */

    echo json_encode([
        "last" => $start + $limit >= count($all),
        "html" => $html,
    ]);
    exit;
}