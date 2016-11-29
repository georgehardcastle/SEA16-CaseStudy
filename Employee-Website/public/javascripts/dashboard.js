$( document ).ready(function() {
  $( ".customer-details" ).click(function() {
    var email = $(this).children("li.customer-email").text();
    $.post( '/customer-order', { email: email }, function( orders ) {
      console.log(orders);
      var source = $("#order-template").html();
      var template = Handlebars.compile(source);
      var data = {
        name: "Jack",
      };
      console.log(data);
      $("#order-info").append(template(data));
    })
  });
});
