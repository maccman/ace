Q = require('q')

function delay(millis, answer) {
     const deferredResult = Q.defer();
     setTimeout(function() {
         deferredResult.resolve(answer);
     }, millis);
     return deferredResult.promise;
 }

 var deferredAnimate = Q.async(function*(element) {
     for (var i = 0; i < 100; ++i) {
        console.log('delayed')
         yield delay(20);
     }
 });

 function test() {
     Q.when(
         deferredAnimate(),
         function () {
             console.log('Done!');
         }
     )
 }

 test()