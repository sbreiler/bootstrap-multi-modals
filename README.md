# bootstrap-multi-modals
Add the possibility to open more than one modal in bootstrap, fixes *all* glitchy problems when doing so.

Tested on Bootstrap Version 3.0.3, all recent versions should work too. Needs jQuery to work.

**Features:**
 - small
 - detect all modals on loading time, or dynamic modals opened by `$('#modalid').modal('show')`
 - fix z-index, later modals are top most
 - fix margin (flicker) on body, when more than one bootstrap model is opened/closed
 - fix non-scrollable modal after closing another modal
 - re-focus top most modal when a modal is closed
 
*Some problems are fixed by bootstrap-js itself in newer versions*

## Samples
Without my fix: https://rawgit.com/sbreiler/bootstrap-multi-modals/master/sample-original.html

With fix: https://rawgit.com/sbreiler/bootstrap-multi-modals/master/sample-withfix.html

## How to use
Just add `<script src="bootstrap-multi-modals.js"></script>` **after** `bootstrap.min.js`/`bootstrap.js` and jQuery

## Similar projects
*"Extends the default Bootstrap Modal class. Responsive, stackable, ajax and more."* https://github.com/jschr/bootstrap-modal

## ToDo
 - on some bootstrap versions, pressing esc won't close the top most modal (see: http://jsfiddle.net/8N3T8/1/)
 - check if modal has backdrop-option enabled, before searching/re-attaching it

---
If you have problems or additions [let me know](https://github.com/sbreiler/bootstrap-multi-modals/issues) :-)
