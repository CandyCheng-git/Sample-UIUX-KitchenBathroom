/*
---------------------------------------------
Gallery
---------------------------------------------
*/

// ---- Projects grid (Isotope + Lightbox) ----
$(window).on('load', function () {
  var $grid = $('#project-grid').isotope({
    itemSelector: '.proj-item',
    percentPosition: true,
    masonry: { columnWidth: '.proj-sizer', gutter: 0 }
  });

  // filter buttons
  $('.projects-filters').on('click', 'button', function(){
    var filterValue = $(this).attr('data-filter');
    $grid.isotope({ filter: filterValue });
    $('.projects-filters button').removeClass('is-checked');
    $(this).addClass('is-checked');
  });

  // re-layout after each image loads (keeps rows tidy)
  $('#project-grid img').each(function(){
    if (this.complete) $grid.isotope('layout');
    else $(this).one('load', function(){ $grid.isotope('layout'); });
  });
});
