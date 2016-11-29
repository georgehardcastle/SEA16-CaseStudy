$( document ).ready(function() {
  $( ".customer-details" ).click(function() {
    var email = $(this).children("li.customer-email").text();
    $.post( '/customer-order', { email: email }, function( ordersGrp ) {

      $( "#customer-order" ).empty();

      for (var i in ordersGrp) {

        var orderCount = 1;

        var orderGrp = ordersGrp[i];

        for (var j in orderGrp) {

          var cart = orderGrp[j].cart;
          var cartTotal = cart.totalPrice;
          var cartQty = cart.totalQty;
          var cartItems = cart.items;

          $( "#customer-order" ).append( "<h4>Order " + orderCount + "</h4>" +
          "<table>" +
            "<tr>" +
              "<th>Items</th>" +
              "<th>Qty</th>" +
              "<th>Price</th>" +
            "</tr>" +
            "<tr>" +
              "<td><i>Total: </i></td>" +
              "<td><strong>" + cartQty + "</strong></td>" +
              "<td><strong>" + cartTotal + "</strong></td>" +
            "</tr>" +
          "</table>");

          orderCount++;

          for (var k in cartItems) {

            var itemDetails = cartItems[k];
            var itemQty = itemDetails.qty;
            var itemPrice = itemDetails.price;
            var item = itemDetails.item;

            var productTitle = item.title;
            var productDescription = item.description;
            var productPrice = item.price;

            $( "#customer-order table" ).append( "<tr>" +
                "<td>" + productTitle + "</td>" +
                "<td>" + itemQty + "</td>" +
                "<td>" + itemPrice + "</td>" +
              "</tr>");
          }
        }

      }
    });
  });
});
