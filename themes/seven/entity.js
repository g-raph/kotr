(function ($) {
    Drupal.behaviors.entity = {
        attach: function (context, settings) {

            // entity song double title fix
            var songTitleFieldOrig = $('.page-admin-structure-entity-type-song-song #eck-entity-form-add-song-song .form-item-title input');
            var songTitleFieldFake = $('.page-admin-structure-entity-type-song-song #eck-entity-form-add-song-song .form-item-field-song-title-und-0-value input');
            songTitleFieldOrig.hide();
            songTitleFieldFake.change(function() {
                songTitleFieldOrig.val($(this).val());
            });

        }
    };
})(jQuery);