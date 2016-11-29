$( document ).ready(function() {

  function handleCatalogSearch() {
    $( "#catalog-details" ).empty();

    var userInput = $( "#catalog-search-input" ).val();

    $.post( '/catalog-search', { input: userInput }, function( productGrp ) {
      for ( i in productGrp) {
        var products = productGrp[i];
        for ( j in products ) {
          var product = products[j];
          $( "#catalog-details" ).append('<ul class="customer-details"> ' +
              '<li><strong>' + product.title + '</strong></li>' +
              '<li>' + product.description + '</li>' +
              '<li>£' + product.price + '</li>' +
              '<li><i>Availability: ' + product.stockLevel + '</i></li>' +
            '</ul>'
          )
        }
      }
    });
  }

  function handleCustomerSearch() {
    var userInput = $( "#customer-search-input" ).val();

    $.post( '/customer-search', { input: userInput }, function( customers ) {
      for ( i in customers) {
        var customer = customers[i];
        for ( j in customer ) {
          $( "#customer-details" ).append('<ul class="customer-details"> ' +
              '<li><strong>' + customer[j].firstname + ' ' + customer[j].lastname + '</strong></li>' +
              '<li>' + customer[j].firstlineofaddress + '</li>' +
              '<li>' + customer[j].town + '</li>' +
              '<li>' + customer[j].postcode + '</li>' +
              '<li>' + customer[j].contactnumber + '</li>' +
              '<li class="customer-email"><i>' + customer[j].email + '</i></li>' +
            '</ul>'
          )
        }
      }
    });
  }

  $( "#customer-search-submit" ).click(function() {
    handleCustomerSearch();
  });

  $("#customer-search-input").on('keyup', function (e) {
    if (e.keyCode == 13) {
        handleCustomerSearch();
    }
  });

  $( "#catalog-search-submit" ).click(function() {
    handleCatalogSearch();
  });

  $("#catalog-search-input").on('keyup', function (e) {
    if (e.keyCode == 13) {
        handleCatalogSearch();
    }
  });

  $(document).on('click', '#customer-details ul', function() {
    var email = $(this).children("li.customer-email").text();
    $.post( '/customer-order', { email: email }, function( ordersGrp ) {

      if ( ordersGrp.orders.length == 0 ) {
        $( "#customer-order" ).empty();
        $( "#customer-order" ).append('<h2 class="dash-tile-no-content">No Orders</h2>');
      } else {
        $( "#customer-order" ).empty();

        for (var i in ordersGrp) {

          var orderCount = 0;

          var orderGrp = ordersGrp[i];

          for (var j in orderGrp) {

            orderCount++;

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

            var $tableSelector = "#customer-order table:nth-child(" + (orderCount*2) + ")";

            for (var k in cartItems) {

              var itemDetails = cartItems[k];
              var itemQty = itemDetails.qty;
              var itemPrice = itemDetails.price;
              var item = itemDetails.item;

              var productTitle = item.title;
              var productDescription = item.description;
              var productPrice = item.price;

              $( $tableSelector ).append( "<tr>" +
                  "<td>" + productTitle + "</td>" +
                  "<td>" + itemQty + "</td>" +
                  "<td>" + itemPrice + "</td>" +
                "</tr>");
            }
          }
        }
      }
    });
  });
});
