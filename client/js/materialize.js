$(document).ready(function(){
  $('.modal').modal();
  $('.datepicker').datepicker({ defaultDate: new Date(), setDefaultDate: true, format:'yyyy-mm-dd' });
  $('.fixed-action-btn').floatingActionButton();
});