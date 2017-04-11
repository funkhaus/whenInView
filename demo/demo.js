// wheninview.watch({
//     selector: 'blockquote',
//     container: '.body-wrap'
// });

wheninview.overlap('blockquote', '.fixed', function(){
    console.log('overlap');
});
