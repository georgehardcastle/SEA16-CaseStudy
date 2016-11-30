$( document ).ready(function() {

  function handleCatalogSearch() {
    $( "#catalog-details" ).empty();

    var userInput = $( "#catalog-search-input" ).val();

    $.post( '/catalog-search', { input: userInput }, function( productGrp ) {
      for ( i in productGrp) {
        var products = productGrp[i];
        for ( j in products ) {
          var product = products[j];
          $( "#catalog-details" ).append('<ul class="catalog-details"> ' +
              '<li class="product-id hidden">' + product._id + '</li>' +
              '<li class="product-title"><strong>' + product.title + '</strong></li>' +
              '<li class="product-description">' + product.description + '</li>' +
              '<li class="product-price">£' + product.price + '</li>' +
              '<li><i>Availability: ' + product.stockLevel + '</i></li>' +
            '</ul>'
          )
        }
      }
    });
  }

  function handleCustomerSearch() {
    $( "#customer-details" ).empty();
    var userInput = $( "#customer-search-input" ).val();

    $.post( '/customer-search', { input: userInput }, function( customers ) {
      for ( i in customers) {
        var customer = customers[i];
        for ( j in customer ) {
          $( "#customer-details" ).append('<ul class="customer-details"> ' +
              '<li class="customer-name"><strong>' + customer[j].firstname + ' ' + customer[j].lastname + '</strong></li>' +
              '<li class="customer-firstlineofaddress">' + customer[j].firstlineofaddress + '</li>' +
              '<li class="customer-town">' + customer[j].town + '</li>' +
              '<li class="customer-postcode">' + customer[j].postcode + '</li>' +
              '<li class="customer-contactnumber">' + customer[j].contactnumber + '</li>' +
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

  var cart = [];

  $(document).on('click', '#catalog-details ul', function() {

    var productId = $(this).children("li.product-id").text();
    var productTitle = $(this).children("li.product-title").text();
    var productDescription = $(this).children("li.product-description").text();
    var productPrice = $(this).children("li.product-price").text();

    var duplicateItem = false;

    if (cart.length == 0) {
      cart.push({id: productId, qty: 1});
      $( "#customer-order-product-details" ).append('<ul class="catalog-details"> ' +
          '<li class="product-id hidden">' + productId + '</li>' +
          '<li><strong>' + productTitle + '</strong></li>' +
          '<li>' + productDescription + '</li>' +
          '<li>' + productPrice + '</li>' +
        '</ul>'
      )
    } else {
      for (item in cart) {
        if (cart[item].id == productId) {
          cart[item].qty++;
          var duplicateItem = true;
        }
      }
      if (duplicateItem == false) {
        cart.push({id: productId, qty: 1});
        $( "#customer-order-product-details" ).append('<ul class="catalog-details"> ' +
            '<li class="product-id hidden">' + productId + '</li>' +
            '<li><strong>' + productTitle + '</strong></li>' +
            '<li>' + productDescription + '</li>' +
            '<li>' + productPrice + '</li>' +
          '</ul>'
        )
      }
    }

    console.log(cart);
  });

  function addDetailsToNewOrder(name, address,town,postcode,contactnumber,email) {
    $( "#customer-order-customer-details" ).empty();

    $( "#customer-order-customer-details" ).append('<ul class="customer-details"> ' +
        '<li><strong>' + name + '</strong></li>' +
        '<li>' + address + '</li>' +
        '<li>' + town + '</li>' +
        '<li>' + postcode + '</li>' +
        '<li>' + contactnumber + '</li>' +
        '<li class="customer-email"><i>' + email + '</i></li>' +
      '</ul>'
    )
  }

  function displayCurrentOrder(email) {
    $.post( '/customer-order', { email: email }, function( ordersGrp ) {

      if ( ordersGrp.orders.length == 0 ) {
        $( "#customer-order" ).empty();
        $( "#customer-order" ).append('<h4 class="dash-tile-no-content">No Orders</h4>');
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
  }

  function addCustomerToUpdateForm(email) {
    $.post( '/customer-update', { email: email }, function( customer ) {
      var value;
      for(var items in customer) {
        value = customer[items]
        var email = value.email;
        var firstname = value.firstname;
        var lastname = value.lastname;
        var firstlineofaddress = value.firstlineofaddress;
        var town = value.town;
        var postcode = value.postcode;
        var contactnumber = value.contactnumber;
      }
      $("#firstname-update").val(firstname);
      $("#lastname-update").val(lastname);
      $("#firstlineofaddress-update").val(firstlineofaddress);
      $("#town-update").val(town);
      $("#postcode-update").val(postcode);
      $("#contactnumber-update").val(contactnumber);
      $("#email-update").val(email);
    });
  }

  $(document).on('click', '#customer-details ul', function() {

    // GRAB CUSTOMER DETAILS FROM VIEW
    var name = $(this).children("li.customer-name").text();
    var address = $(this).children("li.customer-firstlineofaddress").text();
    var town = $(this).children("li.customer-town").text();
    var postcode = $(this).children("li.customer-postcode").text();
    var contactnumber = $(this).children("li.customer-contactnumber").text();
    var email = $(this).children("li.customer-email").text();

    // ADD DETAILS TO NEW CUSTOMER ORDER DASH
    addDetailsToNewOrder(name, address,town,postcode,contactnumber,email);

    // DISPLAY EXISTING CUSTOMER ORDER IN DASH
    displayCurrentOrder(email);

    // UPDATE CUSTOMER DETAILS
    addCustomerToUpdateForm(email);

  });

  $(".update-details-btn" ).click(function() {
    var email = $("#email-update").val();
    var firstName = $("#firstname-update").val();
    var lastName = $("#lastname-update").val();
    var firstlineofaddress = $("#firstlineofaddress-update").val();
    var town =  $("#town-update").val();
    var postcode = $("#postcode-update").val();
    var contactnumber = $("#contactnumber-update").val();

    $.post( '/update-details-dash', {email: email, firstName: firstName, lastName: lastName, firstlineofaddress: firstlineofaddress, town: town, postcode: postcode, contactnumber: contactnumber}, function( customer ) {
        alert(customer);
      });
      handleCustomerSearch();
    });


});
