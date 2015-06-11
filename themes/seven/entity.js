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

            // entity uitvoerder double title fix
            var uitvTitleFieldOrig = $('#eck-entity-form-add-uitvoerder-uitvoerder .form-item-title input');
            var uitvTitleFieldFake = $('#eck-entity-form-add-uitvoerder-uitvoerder  .field-name-field-uitv-name input');
            $('#eck-entity-form-add-uitvoerder-uitvoerder .form-item-title').hide();
            uitvTitleFieldFake.change(function() {
                uitvTitleFieldOrig.val($(this).val());
            });

        }
    };
})(jQuery);