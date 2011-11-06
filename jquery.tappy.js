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
                coords = {x: event.pageX, y: event.pageY};
            else {
                coords = {
                    x: ev.clientX + document.body.scrollLeft - document.body.clientLeft, 
                    y: ev.clientY + document.body.scrollTop  - document.body.clientTop ,
                };
            }
            
            var targetPos = $(event.target).offset();
            return {x: coords.x - targetPos.left, y: coords.y - targetPos.top}; 
        },
        
        distSq: function(a, b) {
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            return dx * dx + dy * dy;
        },
        
        updateDomData: function($elem, key, data) {
            var domData = $elem.data(key);
            $.extend(domData, data);
            $elem.data(key, domData);
        },
        
    };
    
    
    $.fn.tappy = function (opts) {
        
        // initialize options
        var options = {
            tapDistance: 16,        // pixels
            tapInterval: 250,       // milliseconds
        };
        $.extend(options, opts);
        
        var $this = this;
        $this.data('tappy', {lastDragPos: null});

        
        var eventHandlers = {
        
            mouseDown: function(event) {
                if (event.which != 1)   return;
                var coords = utils.getMouseCoords(event);
                $this.trigger(jQuery.Event('dragstart.tappy', coords));
                
                utils.updateDomData($this, 'tappy', {
                    tapDownPos: coords,
                    tapDownTime: $.now(),
                    lastDragPos: coords,    // this starts dragging
                });
            },
            
            mouseUp: function(event) {
                if (event.which != 1)   return;
                var coords = utils.getMouseCoords(event);
                $this.trigger(jQuery.Event('dragend.tappy', coords));
                
                // detect clicks/taps
                var data = $this.data('tappy');
                var withinTapDistance = utils.distSq(data.tapDownPos, coords) < options.tapDistance * options.tapDistance;
                var withinTapTime = $.now() - data.tapDownTime <= options.tapInterval;
                if (withinTapDistance && withinTapTime) {
                    
                    // decide between single and double tap
                    if (!data.singleTapTimer) {
                        var tapTrigger = function() {
                            $this.trigger(jQuery.Event('tap.tappy', coords));
                            utils.updateDomData($this, 'tappy', {singleTapTimer: null});
                        };
                        var tapTimer = setTimeout(tapTrigger, options.tapInterval);
                        utils.updateDomData($this, 'tappy', {singleTapTimer: tapTimer});
                    }
                    else {
                        clearTimeout(data.singleTapTimer);
                        utils.updateDomData($this, 'tappy', {singleTapTimer: null});
                        
                        // this is second tap happening within tap confirmation time:
                        // we should register it as double-tap
                        $this.trigger(jQuery.Event('doubletap.tappy', coords));
                    }
                }
            },
            
            mouseMove: function(event) {
                var coords = utils.getMouseCoords(event);
                $this.trigger(jQuery.Event('move.tappy', coords));
                
                // if drag is in progress, update last drag position
                var data = $this.data('tappy');
                if (data.lastDragPos) {
                    var dx = coords.x - data.lastDragPos.x, dy = coords.y - data.lastDragPos.y;
                    $this.trigger(jQuery.Event('drag.tappy', {dx: dx, dy: dy}));
                    utils.updateDomData($this, 'tappy', {lastDragPos: coords});
                }
            },
        };
        
        $this.bind('mousedown', eventHandlers.mouseDown);
        $this.bind('mouseup', eventHandlers.mouseUp);
        $this.bind('mousemove', eventHandlers.mouseMove);
        
        return $this;
    };

})(jQuery);