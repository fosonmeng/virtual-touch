Virtual Touch
=================

Most of these are stolen from the good project https://github.com/hammerjs/hammer.js .
But some modifications, and some logic is removed.

## What does this project do

There is some environment where general `dom` is not available. Thus we have to
write a decorator for libraries. Otherwise we could write a polyfill for that
environment. But both these approachs are difficult on a platform like _wechat_.
Then the library was refactored.

## Chanages from the original _hammer.js_

* Remove CSS supports and browser features
* no references to `window` or `document`
* A `Virtual` Object as a DOM _proxy_ is exposed
* Only one `Input` Object left (no browser feature supports)


[//]: # (vim: set ft=markdown :)
