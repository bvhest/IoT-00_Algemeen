var $kk1=jQuery.noConflict();
(function($kk1) {
    $kk1(function() {
       $kk1('.jcarousel')
            .jcarousel({
				wrap: 'circular',
            });
        $kk1('.jcarousel-control-prev')
            .on('jcarouselcontrol:active', function() {
                $kk1(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                $kk1(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '-=2'
            });
        $kk1('.jcarousel-control-next')
            .on('jcarouselcontrol:active', function() {
                $kk1(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                $kk1(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '+=2'
            });
        $kk1('.jcarousel-pagination')
            .on('jcarouselpagination:active', 'a', function() {
                $kk1(this).addClass('active');
            })
            .on('jcarouselpagination:inactive', 'a', function() {
                $kk1(this).removeClass('active');
            })
            .jcarouselPagination({
            });
    });
})(jQuery);
