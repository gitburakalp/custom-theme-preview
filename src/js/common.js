$('.btn--black').each(function () {
  var hasSpan = $(this).find('span').length != 0;
  var text = $(this).text().trim();

  !hasSpan ? $(this).text('').append(`<span>${text}</span>`) : '';
});

$('.form-control-block.minus-plus').each(function () {
  var $this = $(this);

  $this.find('[class*=minus],[class*=plus]').on('click', function () {
    var $input = $this.parent().find('input');
    var isChild = $input.attr('id').includes('Child');
    var isMinus = $(this).attr('class').includes('minus');

    var maxVal = $input.data('max');
    var minVal = isChild ? 0 : 1;
    var inputValue = parseInt($input.val());

    if (isMinus) {
      if (inputValue > minVal && inputValue <= maxVal) $input.val(inputValue - 1).change();
    } else if (inputValue < maxVal) $input.val(inputValue + 1).change();

    $input.removeClass('text-anim');

    setTimeout(() => {
      $input.addClass('text-anim');
    }, 0);

    if (isChild) {
      inputValue = parseInt($input.val());
      var arr = ['', 1, 2, 3];
      var $childHidden = $('[child-hidden]');

      for (i in (inputValue <= 0 ? $childHidden.addClass('d-none') : $childHidden.removeClass('d-none'), arr)) {
        if (i > 0) {
          let a = $childHidden.find(`.row > *:nth-child(${arr[i]})`);
          i <= inputValue && i > 0 ? a.removeClass('d-none') : a.addClass('d-none');
        }
      }
    }
  });
});
