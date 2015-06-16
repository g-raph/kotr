(function ($) {
    Drupal.behaviors.entity = {
        attach: function (context, settings) {

            // entity componist double title fix
            var compTitleFieldOrig = $('#eck-entity-form-add-componist-componist .form-item-title input');
            var compTitleFieldFake = $('#eck-entity-form-add-componist-componist  .field-name-field-componist-name input');
            $('#eck-entity-form-add-componist-componist .form-item-title').hide();
            compTitleFieldFake.change(function() {
                compTitleFieldOrig.val($(this).val());
            });

            // entity componist double title fix inline
            var compTitleFieldOrig2 = $('.node-song-form #edit-field-song-comp-und-form .form-item-field-song-comp-und-form-title input');
            var compTitleFieldFake2 = $('.node-song-form #edit-field-song-comp-und-form input#edit-field-song-comp-und-form-field-componist-name-und-0-value');
            $('.node-song-form #edit-field-song-comp-und-form .form-item-field-song-comp-und-form-title').hide();
            compTitleFieldFake2.change(function() {
                compTitleFieldOrig2.val($(this).val());
            });

            // entity uitvoerder double title fix
            var uitvTitleFieldOrig = $('#eck-entity-form-add-uitvoerder-uitvoerder .form-item-title input');
            var uitvTitleFieldFake = $('#eck-entity-form-add-uitvoerder-uitvoerder  .field-name-field-uitv-name input');
            $('#eck-entity-form-add-uitvoerder-uitvoerder .form-item-title').hide();
            uitvTitleFieldFake.change(function() {
                uitvTitleFieldOrig.val($(this).val());
            });

            // entity componist double title fix inline
            var uitvTitleFieldOrig2 = $('#edit-field-song-uitv-und-form .form-item-field-broadcast-ctsong-und-form-field-song-comp-und-form-title input');
            var uitvTitleFieldFake2 = $('#edit-field-song-uitv-und-form-field-uitv-name input');
            $('#edit-field-song-uitv-und-form > div > div.form-item.form-type-textfield.form-item-field-song-uitv-und-form-title').hide();
            uitvTitleFieldFake2.change(function() {
                uitvTitleFieldOrig2.val($(this).val());
            });

        }
    };
})(jQuery);