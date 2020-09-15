$('.popover-trigger').on('click', function () {
  $(this).siblings().toggleClass('is-shown');
});

$('.popovers').each(function () {
  var cssClass = 'is-shown';

  $('#inpAdultCount,#inpChildCount').change(function () {
    var $this = $(this);
    var relItem = $this.data('related-item');

    $(relItem).text($this.val().trim());
  });

  $(this)
    .find('.close-btn')
    .on('click', function () {
      $('.popovers').removeClass(cssClass);
    });

  $('body').on('click', function (e) {
    var isPopovers = $(e.target).closest('.popovers').length != 0 || $(e.target).closest('.popover-trigger').length != 0;

    if (!isPopovers) {
      $('.popovers').removeClass(cssClass);
    }
  });
});
