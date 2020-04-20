        </div><!-- /sections -->

        <div class="section section--footer">
            <div class="section__inner section__inner--footer">
                <div class="footer">
                    &copy;
                </div>
            </div>
        </div><!-- /footer -->

        <div class="cookie js-cookie" style="display:none">
            <div class="cookie__inner">
                <div class="cookie__text">
                    <?= __("Просматривая этот сайт, вы соглашаетесь с нашей политикой конфиденциальности.") ?>
                    <a href="/_ajax-popup.php" data-popup-ajax><?= __("Подробнее")  ?></a>
                </div>
                <button class="cookie__button button js-cookie-close"><?= __("Согласен") ?></button>
            </div>
        </div><!-- /cookie -->

        <script src="/js/main.js?<?= filemtime('js/main.js') ?>"></script>
    </body>
</html>