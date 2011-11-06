/**
    jQuery.Tappy
    Provides support for pointer-device events (taps/clicks, etc.)
    to DOM elements that lacks it (most notably <canvas>).
    @author Karol Kuczmarski "Xion"
    @license BSD
*/


(function ($) {

    var utils = {
    
        getMouseCoords: function(event) {
            /* Retrieves mouse coordinates from given event object
               (received in some mouse event handler).
               @return Coordinates (as x,y fields) relative to top-left corner of event target DOM element */
            if (!event)
                throw { name: 'ReferenceError', message: "No event object to retrieve coordinates from" };
                
            var coords;
            if (event.pageX || event.pageY)
                coords = {x: event.pageX, y; event.pageY};
            else {
                coords = {
                    x: ev.clientX + document.body.scrollLeft - document.body.clientLeft, 
                    y: ev.clientY + document.body.scrollTop  - document.body.clientTop ,
                };
            }
            
            var targetPos = $(event.target).offset();
            return {x: coords.x - targetPos.left, y: coords.y - targetPos.top}; 
        },
        
    };


    $.fn.tappy = function (options) {
        
    };

})(jQuery);