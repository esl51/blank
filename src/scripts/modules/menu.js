/* Menu */
$(function() {
    $(".js-menu-toggle").on("change", function() {
        if ($(this).is(":checked")) {
            $(".js-menu").addClass("active");
        } else {
            $(".js-menu").removeClass("active");
        }
    });
});