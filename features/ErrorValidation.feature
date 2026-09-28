Feature: Ecommerce validations

  @Validation
  Scenario Outline: Placing the order
    Given a login to Ecommerce2 application with "<username>" and "<password>"
    Then Verify Error message is displayed
  
  Examples:
    | username          | password  |
    | param@param.com   | P@ssw0rd    |
    | hello@123.com     | Password123 |
    