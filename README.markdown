# jQuery.Tappy

_jQuery.Tappy_ is a small plugin that aims to provide support for basic pointer-based gestures (such as single and double clicks/taps,
and dragging) to DOM elements that don't support them - or support poorly. The prime use is probably for the <code><canvas></code> element.

Usage
-
Once you initialize a DOM element with <code>tappy()</code>, you can bind handlers to events it generates:

```javascript
$('canvas').tappy();
$('canvas').on('tap.tappy', canvas_tap);
$('canvas').on('doubletap.tappy', canvas_doubletap);

function canvas_tap(event) {
    var x = event.x, y = event.y;
    // ...
}
```

Events
-
All events reside in <code>.tappy</code> namespace. All coordinates received by event handlers are always
relative to top-left corner of the <code>tappy()</code>'d DOM element.

* <code>move</code> - Movement of the pointer. Event object contains <code>x</code> and <code>y</code> coordinates.
* <code>tap</code> - Single tap/click. Event object contains <code>x</code> and <code>y</code> coordinates.
* <code>doubletap</code> - Double tap/click. Event object contains <code>x</code> and <code>y</code> coordinates.
* <code>dragstart</code> - Start of dragging, or mouse-down event. Event object contains <code>x</code> and <code>y</code> coordinates.
* <code>dragend</code> - Start of dragging, or mouse-down event. Event object contains <code>x</code> and <code>y</code> coordinates.
* <code>drag</code> - Drag event. Besides <code>x</code> and <code>y</code> coordinates, event object contains
                      <code>dx</code> and <code>dy</code> values that are equal to movement of the pointer since
                      the last <code>drag</code> event.


Options
-
<code>tappy()</code> accepts a non-mandatory argument: an object with options overriding plugin's default settings.
These options are the following:

* <code>tapDistance</code> - Maximum distance (in pixels) between two subsequent taps/clicks that are to be counted as <code>doubletap</code>.
* <code>tapInterval</code> - Maximum time interval (in milliseconds) between two subsequent taps/clicks that are to be counted as <code>doubletap</code>.
