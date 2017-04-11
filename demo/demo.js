
wheninview.watchOverlap('blockquote', '.fixed', function(a, b){
    b.classList.add('overlap')
}, function(a, b){
    b.classList.remove('overlap')
}, '.body-wrap');
