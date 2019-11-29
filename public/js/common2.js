Nprogress.configure({
  showSpinner: false
});
$(window).ajaxStart(function() {
  Nprogress.start();
});
$(window).ajaxComplete(function() {
  Nprogress.done();
});
