function async(callback) {
    gen = callback()
    cb = gen.send()
        cb.value.push(function(){
            gen.next()
        })
}

function sleep(time) {
    var arr = []

    setTimeout(function(){
        arr.forEach(function(v){
            v()
        })
    }, time)
    return arr;
}

async(function*(){
  console.log('sleeping')
  yield sleep(2000)
  console.log('slept')
});