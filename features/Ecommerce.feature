Feature: Ecommerce validations

  @Regression
  Scenario: Placing the order
    Given a login to Ecommerce application with "param@param.com" and "P@ssw0rd"
    When Add "ZARA COAT 3" to the cart
    Then Verify "ZARA COAT 3" is displayed in the Cart
    When Enter valid details and Place the Order
    Then Verify order is present in the OrderHistory


  @Validation
  Scenario Outline: Placing the order
    Given a login to Ecommerce2 application with "<username>" and "<password>"
    Then Verify Error message is displayed

    Examples:
      | username        | password    |
      | param@param.com | P@ssw0rd    |
      | hello@123.com   | Password123 |
