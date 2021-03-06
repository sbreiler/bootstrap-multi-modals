/*!
 * bootstrap-multi-modals v0.1.2 (https://github.com/sbreiler/bootstrap-multi-modals)
 *
 * Copyright (c) 2017 Steffen Breiler
 * Licensed under MIT (https://github.com/sbreiler/bootstrap-multi-modals/blob/master/LICENSE)
 */

+function ($) {
    'use strict';

    var zindex = 2000;
    var modal_list = $('.modal'); // get a list of all existing modals
    var $body = $('body');
    var originalBodyPad = parseInt($body.css('padding-right'), 10);

    var measureScrollbar = function () {
        // almost exact copy of source of modal.js
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'modal-scrollbar-measure';
        $body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        $body[0].removeChild(scrollDiv);
        return scrollbarWidth;
    };
	
	var moveBackdrop = function (element, zindex) {
		// attach backdrop to modal (fix for older bootstrap release)		
		if( ($(this).find('.modal-backdrop').length === 0) && ($('body > .modal-backdrop').length > 0) ) {
			var $backdrop = $('body > .modal-backdrop').last();
			
			/*if( $(this).parent().is($body) ) {
				$body.append(
					// create helper div
					$('<div />')
						.append(this)
						.append($backdrop)
				);
			}
			else {*/
				//$(this).parent().append($backdrop);
			//}
			
			$backdrop.css('z-index', zindex);
		}
	};

    var attachEvents = function(to) {
        $(to).on('show.bs.modal', function (e) {
            // fix z-index -> put this modal on the very top
            zindex = zindex + 2;
            $(this).css('z-index', zindex);

            // reset orginal padding-right (as if this modal is the first one), so modal-plugin can do it's "thing"
            $body.css('padding-right', originalBodyPad);
			
			// try to run moveBackdrop soon (reduce backdrop "flicker")
			// won't work if we run this immediately, because backdrop is created after this event is fired
			setTimeout($.proxy(moveBackdrop, this, this, zindex - 1), 10);
        });

        $(to).on('shown.bs.modal', function (e) {
			moveBackdrop(this, zindex - 1); // run again, if it didn't worked the first time
			
            // re-focus
			$(this).trigger('focus');
        });

        $(to).on('hidden.bs.modal', function(e) {
            var $visible_modals = $('.modal:visible'); // get a list of visible modals, after closing this one

            if( $visible_modals.length > 0 ) {
                // this closing modal reseted the padding, so we need to re-apply it (still open modals!)
                $body.css('padding-right', originalBodyPad + measureScrollbar());

                // if a second modal is closed, the first modal is unscrollable - to fix that,
                // re-add the following class to the body
                // credits goes to "H Dog": http://stackoverflow.com/a/30876481/4945333
                $('body', document).addClass('modal-open');
                // re-run on older version, to get executed after all 'hidden.bs.modal'-Events are run
                setTimeout(function() {
                    $('body', document).addClass('modal-open');
                }, 10);

                // focus the top most modal
                var topMostModal = null;
                var topMostzIndex = -1;

                $visible_modals.each(function() {
                    var zIndex = $(this).css('z-index');

                    if( zIndex > topMostzIndex ) {
                        topMostModal = $(this);
                        topMostzIndex = zIndex;
                    }
                });

                if(topMostModal) {
                    $(topMostModal).trigger('focus');
                }
				
				if( $('body > .modal-backdrop').length > 0 ) {
					$('body > .modal-backdrop').last().css('z-index', topMostzIndex - 1);
				}
            }
            else {
                // shouldn't be needed, but just in case reset padding on last modal
                $body.css('padding-right', originalBodyPad);
            }
        });
    };

    attachEvents(modal_list);

    // replace $.modal(...) function to get a hold on dynamically created modals
    var org_modal = $.fn.modal;
    $.fn.modal = function() {
        // check each element matched by selector (provided by "this"), if it's
        // in our modal_list - if not, add it and attach events
        this.each(function() {
            var found = false;
            var $that = $(this);
            modal_list.each(function(){
                if( $(this).is($that) ) {
                    found = true;
                }
            });
            if( false === found ) {
                attachEvents($that);
                modal_list = modal_list.add($(this));
            }
        });

        // call orginal $.modal(...) function
        // 1) inject "this" to the function (~html-elements/jquery-elements)
        // 2) passthrough any argument
        return org_modal.apply(this, arguments);
    };
}(jQuery);
