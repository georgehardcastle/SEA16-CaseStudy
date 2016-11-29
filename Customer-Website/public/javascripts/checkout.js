Stripe.setPublishableKey('pk_test_zEP14tvyehqXbqqbLZingSZM');

var $form = $('#checkout-form');

$form.submit(function(event) {
  $('#charge-error').addClass('hidden');
  $form.find('button').prop('disabled', true);
  Stripe.card.createToken({
    number: $('#cardNumber').val(),
    cvc: $('#card-cvc').val(),
    exp_month: $('#card-expiry-month').val(),
    exp_year: $('#card-expiry-year').val(),
    name: $('#card-name').val()
  }, stripeResponseHandler);
  return false;
});

function stripeResponseHandler(status, response) {
  if (response.error) { // Problem!
    // Show the errors on the form:
    $('#charge-error').text(response.error.message);
    $('#charge-error').removeClass('hidden');
    $form.find('button').prop('disabled', false); // Re-enable submission
  } else { // Token was created!
    // Get the token ID:
    var token = response.id;
    // Insert the token ID into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken">').val(token));
    // Submit the form:
    $form.get(0).submit();
  }
}

var $businessForm = $('#checkout-form-business');

$businessForm.submit(function(event) {
  if ( $('#purchaseOrderNoBusiness').val() == "") {
    $('#charge-error').addClass('hidden');
    $form.find('button').prop('disabled', true);
    Stripe.card.createToken({
      number: $('#cardNumberBusiness').val(),
      cvc: $('#card-cvc-business').val(),
      exp_month: $('#card-expiry-month-business').val(),
      exp_year: $('#card-expiry-year-business').val(),
      name: $('#card-name-business').val()
    }, stripeResponseHandlerBusiness);
    return false;
  }
});

function stripeResponseHandlerBusiness(status, response) {
  if (response.error) { // Problem!
    // Show the errors on the form:
    $('#charge-error').text(response.error.message);
    $('#charge-error').removeClass('hidden');
    $businessForm.find('button').prop('disabled', false); // Re-enable submission
  } else { // Token was created!
    // Get the token ID:
    var token = response.id;
    // Insert the token ID into the form so it gets submitted to the server:
    $businessForm.append($('<input type="hidden" name="stripeToken">').val(token));
    // Submit the form:
    $businessForm.get(0).submit();
  }
}

var visibility = 0;
function visibilityCounter() {
  visibility ++;
  if (visibility % 2 == 0) {
    $('#purchaseOrderNoBusiness').val("");
  }
  else {
    $('#cardNumberBusiness').val(""),
    $('#card-cvc-business').val(""),
    $('#card-expiry-month-business').val(""),
    $('#card-expiry-year-business').val(""),
    $('#card-name-business').val("")
  }
}
