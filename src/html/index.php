<?php include "./_head.php"; ?>

<div class="section">
    <div class="section__inner">
        <h2 class="section__title">Icons</h2>

        <div class="icons-demo">

            <?php foreach (glob("icons/*.svg") as $filename): ?>

                <span class="icons-demo__item"><?= icon(substr(basename($filename), 0, -4)) ?></span>

            <?php endforeach ?>

        </div>

    </div>
</div>

<div class="section">
    <div class="section__inner">
        <h2 class="section__title">Breadcrumbs</h2>
        <ul class="breadcrumbs">
            <li class="breadcrumbs__item">
                <a class="breadcrumbs__link" href="">Главная</a>
                <?= icon("next", "breadcrumbs__corner") ?>
            </li>
            <li class="breadcrumbs__item">
                <a class="breadcrumbs__link" href="">Новости</a>
                <?= icon("next", "breadcrumbs__corner") ?>
            </li>
            <li class="breadcrumbs__item">
                <a class="breadcrumbs__link" href="">Новости спорта</a>
                <?= icon("next", "breadcrumbs__corner") ?>
            </li>
        </ul>
    </div>
</div>

<div class="section">
    <div class="section__inner">
        <h2 class="section__title">xSlider: basic</h2>
    </div>
</div>

<div class="xslider js-xslider">
    <div class="xslider__viewport" data-viewport>
        <ul class="xslider__track" data-track>
            <li class="xslider__item">
                <img src="img/temp/tmp1s.jpg" alt="">
            </li>
            <li class="xslider__item">
                <img src="img/temp/tmp2s.jpg" alt="">
            </li>
            <li class="xslider__item">
                <img src="img/temp/tmp3s.jpg" alt="">
            </li>
            <li class="xslider__item">
                <img src="img/temp/tmp4s.jpg" alt="">
            </li>
            <li class="xslider__item">
                <img src="img/temp/tmp5s.jpg" alt="">
            </li>
        </ul>
    </div>
    <div class="xslider__arrows">
        <button class="xslider__arrow" data-prev><?= icon("prev") ?></button>
        <button class="xslider__arrow" data-next><?= icon("next") ?></button>
    </div>
</div>

<div class="section">
    <div class="section__inner">
        <h2 class="section__title">xSlider: carousel</h2>
    </div>
</div>

<div class="xslider xslider--carousel-3 js-xslider">
    <div class="xslider__viewport" data-viewport>
        <ul class="xslider__track" data-track>
            <li class="xslider__item">
                <img src="img/temp/tmp1s.jpg" alt="">
            </li>
            <li class="xslider__item">
                <img src="img/temp/tmp2s.jpg" alt="">
            </li>
            <li class="xslider__item">
                <img src="img/temp/tmp3s.jpg" alt="">
            </li>
            <li class="xslider__item">
                <img src="img/temp/tmp4s.jpg" alt="">
            </li>
            <li class="xslider__item">
                <img src="img/temp/tmp5s.jpg" alt="">
            </li>
        </ul>
    </div>
    <div class="xslider__arrows">
        <button class="xslider__arrow" data-prev><?= icon("prev") ?></button>
        <button class="xslider__arrow" data-next><?= icon("next") ?></button>
    </div>
</div>

<div class="section section--breadcrumbs" style="background:#eee">
    <div class="section__inner section__inner--breadcrumbs">
        <?php include "./_breadcrumbs.php"; ?>
    </div>
</div><!-- /breadcrumbs -->

<div class="section section--body">
    <div class="section__inner section__inner--body">
        <div class="text">
            <h1>Привет!</h1>
            <p>Стратегический маркетинг отражает рейтинг. План размещения, пренебрегая деталями, повсеместно определяет целевой сегмент рынка. Имидж, в рамках сегодняшних воззрений, исключительно определяет бюджет на размещение, расширяя долю рынка. Стратегическое планирование, анализируя результаты рекламной кампании, сознательно притягивает медийный канал.</p>
            <blockquote>
                <p>Согласно ставшей уже классической работе Филипа Котлера, потребление развивает презентационный материал, не считаясь с затратами. Управление брендом сознательно экономит типичный пресс-клиппинг, повышая конкуренцию.</p>
                <p style="text-align:right">&copy; Питер Пен</p>
            </blockquote>
            <h2>Креативный инструмент маркетинга: методология и особенности</h2>
            <p>Как отмечает Майкл Мескон, комплексный анализ ситуации раскручивает бюджет на размещение, используя опыт предыдущих кампаний. К тому же баинг и селлинг однообразно <a href="img/temp/tmp1.jpg">тормозит эмпирический медиамикс</a>, не считаясь с затратами. Спонсорство достижимо в разумные сроки. Позиционирование на рынке настроено позитивно. Еще Траут показал, что российская специфика тормозит коллективный стиль менеджмента, расширяя долю рынка.</p>
            <p>Согласно ставшей уже классической работе <em>Филипа Котлера</em>, потребление развивает презентационный материал, не считаясь с затратами. Управление брендом сознательно экономит типичный пресс-клиппинг, повышая конкуренцию. Продвижение <a href="img/temp/tmp2.jpg">проекта реально переворачивает</a> эмпирический отраслевой стандарт, работая над проектом. Формирование имиджа ригиден как никогда. Общество потребления восстанавливает креативный бюджет на размещение, осознав маркетинг как часть производства.</p>
            <p>Ассортиментная политика предприятия без оглядки на авторитеты все еще интересна для многих. Представляется логичным, что традиционный канал традиционно тормозит продуктовый ассортимент, осознавая социальную <strong>ответственность бизнеса</strong>. Ретроконверсия <a href="#" class="js-ajax">национального</a> наследия решительно индуцирует типичный рекламный клаттер, учитывая современные тенденции. Взаимодействие корпорации и клиента порождает побочный PR-эффект, работая над проектом. Российская специфика, как следует из <a href="http://www.youtube.com/watch?v=dQw4w9WgXcQ" data-popup-iframe>вышесказанного</a>, директивно изменяет эксклюзивный инвестиционный продукт, осознавая социальную ответственность бизнеса. Стратегический рыночный план, на первый взгляд, индуцирует системный анализ, не считаясь с затратами.</p>
            <h3>Маркированный список</h3>
            <ul>
                <li>Как найти новый источник клиентов не затратив при этом ни копейки;</li>
                <li>Основные принципы переговоров с клиентами и партнерами;</li>
                <li>Взаимодействие корпорации и клиента порождает побочный PR-эффект, работая над проектом. Российская специфика, как следует из вышесказанного, директивно изменяет эксклюзивный инвестиционный продукт, осознавая социальную ответственность бизнеса. Стратегический рыночный план, на первый взгляд, индуцирует системный анализ, не считаясь с затратами;</li>
                <li>Основные принципы мотивации...</li>
            </ul>
            <h4>Нумерованный список</h4>
            <ol>
                <li>Как найти новый источник клиентов не затратив при этом ни копейки;</li>
                <li>Основные принципы переговоров с клиентами и партнерами;</li>
                <li>Как уничтожить взглядом конкурентов и вывести свой бизнес на новый уровень;</li>
                <li>Основные принципы мотивации...</li>
                <li>Как найти новый источник клиентов не затратив при этом ни копейки;</li>
                <li>Основные принципы переговоров с клиентами и партнерами;</li>
                <li>Как уничтожить взглядом конкурентов и вывести свой бизнес на новый уровень;</li>
                <li>Основные принципы мотивации...</li>
                <li>Как найти новый источник клиентов не затратив при этом ни копейки;</li>
                <li>Основные принципы переговоров с клиентами и партнерами;</li>
                <li>Как уничтожить взглядом конкурентов и вывести свой бизнес на новый уровень;</li>
                <li>Основные принципы мотивации...</li>
            </ol>
            <h5>Таблица</h5>
            <table>
                <thead>
                    <tr>
                        <th>Креативный инструмент</th>
                        <th>Майкл Мескон</th>
                        <th>Принципы переговоров</th>
                        <th>Стратегический</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Как найти новый источник клиентов</td>
                        <td>Основные принципы мотивации</td>
                        <td>3</td>
                        <td>5</td>
                    </tr>
                    <tr>
                        <td>Источник клиентов</td>
                        <td>Принципы мотивации</td>
                        <td>105</td>
                        <td>5</td>
                    </tr>
                    <tr>
                        <td>Как найти</td>
                        <td>Основные принципы</td>
                        <td>3</td>
                        <td>80</td>
                    </tr>
                    <tr>
                        <td>Как найти клиентов</td>
                        <td>Основные мотивации</td>
                        <td>3</td>
                        <td>5</td>
                    </tr>
                </tbody>
            </table>
            <h6>Код</h6>
            <code>
            &lt;a class="file__download" href="#" target="_blank"&gt;
            <br>&nbsp; &nbsp; &lt;span class="i-download"&gt;&lt;/span&gt;
            <br>&lt;/a&gt;
            </code>
            <h2>Встроенное адаптивное видео</h2>
            <div class="iframe-video" data-iframe tabindex="0">
                <img src="img/temp/tmp1.jpg" alt="">
                <iframe data-src="<?= prepareEmbedLink('http://www.youtube.com/watch?v=dQw4w9WgXcQ') ?>" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe>
                <div class="iframe-video__title">Iframe video</div>
                <?= icon("play", "iframe-video__play") ?>
            </div>
        </div>
    </div>
</div>

<div class="section section--pagination" style="background:#f1f1f1">
    <div class="section__inner section__inner--pagination">
        <?php include "./_pagination.php"; ?>
    </div>
</div><!-- /pagination -->

<div class="section section--files">
    <div class="section__inner section__inner--files">
        <?php include "./_files.php"; ?>
    </div>
</div><!-- /files -->

<div class="section section--buttons" style="background:#ddd">
    <div class="section__inner section__inner--buttons">
        <h2 class="section__title">Popups</h2>
        <div class="buttons row">
            <div class="buttons_col col col--xs-12">
                <button class="button js-feedback">form</button>
                <button class="button js-iframe">iframe</button>
                <button class="button js-ajax">ajax</button>
            </div>
        </div>
    </div>
</div>

<div class="xpopup xpopup--form js-xpopup-form" data-toggle=".js-feedback">
    <div class="xpopup__inner">
        <div class="xpopup__dialog">
            <div class="xpopup__header">
                <div class="xpopup__title"><?= __("Обратная связь") ?></div>
                <button class="xpopup__close" aria-label="Закрыть" data-close></button>
            </div>
            <form class="xform js-xform">
                <?= renderHidden(['name' => 'xform', 'value' => 'feedback']); ?>
                <div class="xform__section">
                    <div class="xform__section-header">
                        <h3 class="xform__section-title">Общие сведения</h3>
                    </div>
                    <?= renderField('input', ['name' => 'name', 'label' => $xForms["feedback"]["fields"]["name"]["label"], 'required' => true, 'value' => 'robert paulson']) ?>
                    <div class="xform__row row">
                        <div class="xform__col col col--xs-12 col--md-6">
                            <?= renderField('input', ['name' => 'email', 'type' => 'email', 'label' => $xForms["feedback"]["fields"]["email"]["label"], 'required' => true, 'value' => 'r.paulson@example.com']) ?>
                        </div>
                        <div class="xform__col col col--xs-12 col--md-6">
                            <?= renderField('input', ['name' => 'phone', 'type' => 'tel', 'label' => $xForms["feedback"]["fields"]["phone"]["label"]]) ?>
                        </div>
                    </div>
                    <?= renderField('textarea', ['name' => 'message', 'label' => $xForms["feedback"]["fields"]["message"]["label"]]) ?>
                    <?= renderField('select', ['name' => 'theme', 'label' => __("Тема"), "options" => [
                        '1' => 'Взаимодействие корпорации и клиента',
                        '2' => 'Стратегический рыночный план, на первый взгляд, индуцирует системный анализ, не считаясь с затратами',
                    ]]) ?>
                </div>
                <div class="xform__section">
                    <div class="xform__section-header">
                        <h3 class="xform__section-title">Дополнительно</h3>
                    </div>
                    <div class="xform__row row">
                        <div class="xform__col col col--xs-6">
                            <?= renderField('radios', ['name' => 'radio', 'label' => __("Радио-кнопки"), "options" => [
                                '1' => 'Взаимодействие',
                                '2' => 'Системный анализ',
                            ], 'value' => '1']) ?>
                        </div>
                        <div class="xform__col col col--xs-6">
                            <?= renderField('checkboxes', ['name' => 'checkbox', 'label' => __("Флаги"), "options" => [
                                '1' => 'Корпорации',
                                '2' => 'Клиента',
                            ], 'values' => ['2']]) ?>
                        </div>
                    </div>
                </div>
                <div class="xform__section">
                    <div class="xform__section-header">
                        <h3 class="xform__section-title">Файлы</h3>
                    </div>
                    <?= renderField('file', ['name' => 'file1', 'label' => 'Файл', 'required' => true]) ?>
                    <?= renderField('file', ['name' => 'file2', 'label' => 'Файлы', 'multiple' => true]) ?>
                </div>
                <div class="xform__footer">
                    <button class="button xform__button xform__button--submit" type="submit"><?= $xForms["feedback"]["submit"]["label"] ?></button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="xpopup xpopup--transparent js-xpopup-iframe" data-toggle=".js-iframe">
    <div class="xpopup__inner">
        <div class="xpopup__dialog">
            <div class="xpopup__header">
                <div class="xpopup__title"><?= __("YouTube") ?></div>
                <button class="xpopup__close" aria-label="Закрыть" data-close></button>
            </div>
            <div class="iframe-video" data-iframe tabindex="0">
                <iframe data-src="<?= prepareEmbedLink('http://www.youtube.com/watch?v=dQw4w9WgXcQ') ?>" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe>
            </div>
        </div>
    </div>
</div>

<div class="xpopup js-xpopup-ajax" data-toggle=".js-ajax">
    <div class="xpopup__inner">
        <div class="xpopup__dialog">
            <div class="xpopup__header">
                <div class="xpopup__title"><?= __("Ajax") ?></div>
                <button class="xpopup__close" aria-label="Закрыть" data-close></button>
            </div>
            <div class="js-xloader" data-ajax data-params='{ "data": "test" }' data-load-on-mount="false" data-append="false"></div>
        </div>
    </div>
</div>

<?php include "./_foot.php";