parallaxer.js
==========

HTML/JavaScript smooth parallaxe effect library orginally developed for [Boy-Coy](http://boy-coy.com).

> This library is under development. API may change.

### Usage

#### Dependences
* jQuery
* Modernizr
* requestAnimationFrame polyfill (for older browsers only)

#### Download

To download parallaxer.js you can use [bower](http://bower.io):
```
bower install parallaxer.js
```
> Bower will also download dependences.

Alternatively, you can manually download the minified library (can be found in dist directory).

#### Use

Having .js files in place you can include them in your HTML.
```html
<script src="bower_components/parallaxer.min.js"></script>
```

> Don't forget to include dependences.

Now you can add data attributes to HTML elements that will be parallaxed, e.g.:
```html
<div data-parallaxer="enabled" data-parallaxer-speed="1"></div>
<div data-parallaxer="enabled" data-parallaxer-speed="0.5"></div>
```
Each element will create separate parallaxe layer. Value of `data-parallaxer-speed` argument will decide how fast each element will move relatively to normal scroll speed.

Because of the nature of this parallaxe library all elements have to be "parallaxe enabled", otherwise they won't move as smooth as "parallaxe enabled" elements. If you want them to move with "normal" scroll speed just leave `data-parallaxer-speed` value set to 1.

> Of course you can nest other elements in parallaxe enabled ones. 

The last step is to call `start` method when HTML is loaded:
```javascript
$('document').ready(function () {
    andrzejdus.parallaxer.Parallaxer.start();
});
```

### Example

For simple usage example look to example directory.

### Building

Prerequisites:
* npm
* grunt cli

Building:
```
npm install
grunt
```
Build output goes to dist directory.
