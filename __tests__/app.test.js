const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
jest.dontMock('fs');

describe('Testing the functionality, this is 2-step form wizard', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
  });

  afterEach(() => {
    // restore the original func after test
    jest.resetModules();
  });

  it("should return false for valid value or error message for invalid value", () => {
    let {validate} = require('../js/index.js');

    // Validate rule: "required"
    const stringRequired = validate("word", ["required"]);
    const charRequired = validate("c", ["required"]);
    const numberRequired = validate("1", ["required"]);
    const emptyRequired = validate("", ["required"]);

    expect(stringRequired).toEqual(false);
    expect(charRequired).toEqual(false);
    expect(numberRequired).toEqual(false);
    expect(emptyRequired).toEqual("is required!");

    // Validate rule: "phone"
    for (let i = 0; i < 50; i++) {
      let random8 = Math.floor(Math.random() * (100000000));
      while (random8 < 10000000) {
        let pad = Math.floor(Math.random() * (10)) + 1;
        random8 = pad.toString() + random8;
      }

      expect(validate("02" + random8, ["phone"])).toBeFalsy();
      expect(validate("03" + random8, ["phone"])).toBeFalsy();
      expect(validate("04" + random8, ["phone"])).toBeFalsy();
      expect(validate("07" + random8, ["phone"])).toBeFalsy();
      expect(validate("08" + random8, ["phone"])).toBeFalsy();
      expect(validate("612" + random8, ["phone"])).toBeFalsy();
      expect(validate("613" + random8, ["phone"])).toBeFalsy();
      expect(validate("614" + random8, ["phone"])).toBeFalsy();
      expect(validate("617" + random8, ["phone"])).toBeFalsy();
      expect(validate("618" + random8, ["phone"])).toBeFalsy();
      expect(validate("+612" + random8, ["phone"])).toBeFalsy();
      expect(validate("+613" + random8, ["phone"])).toBeFalsy();
      expect(validate("+614" + random8, ["phone"])).toBeFalsy();
      expect(validate("+617" + random8, ["phone"])).toBeFalsy();
      expect(validate("+618" + random8, ["phone"])).toBeFalsy();
      expect(validate("00" + random8, ["phone"])).toEqual("is invalid!");
      expect(validate("01" + random8, ["phone"])).toEqual("is invalid!");
      expect(validate("05" + random8, ["phone"])).toEqual("is invalid!");
      expect(validate("06" + random8, ["phone"])).toEqual("is invalid!");
      expect(validate("09" + random8, ["phone"])).toEqual("is invalid!");
      expect(validate("610" + random8, ["phone"])).toEqual("is invalid!");
      expect(validate("611" + random8, ["phone"])).toEqual("is invalid!");
      expect(validate("615" + random8, ["phone"])).toEqual("is invalid!");
      expect(validate("616" + random8, ["phone"])).toEqual("is invalid!");
      expect(validate("619" + random8, ["phone"])).toEqual("is invalid!");
      expect(validate(random8, ["phone"])).toEqual("is invalid!");
      expect(validate("", ["phone"])).toBeFalsy();
    }

    // Validate rule: "required postcode"
    expect(validate("", ["required", "postcode"])).toEqual("is required!");

    for (let i = 0; i < 50; i++) {
      let random4 = Math.floor(Math.random() * (10000));
      let random4Str = random4.toString();
      while (random4Str.length < 4) {
        let pad = Math.floor(Math.random() * (10)) + 1;
        random4Str = "0" + random4Str;
      }

      if (random4 >= 800 && random4 <= 7999) {
        expect(validate(random4Str, ["required", "postcode"])).toBeFalsy();
      } else {
        expect(validate(random4Str, ["required", "postcode"])).toEqual("is invalid!");
      }
    }

    // Validate rule: "select"
    expect(validate(0, ["required", "select"])).toEqual("is required!");
    expect(validate(1, ["required", "select"])).toBeFalsy();
    expect(validate("", ["required", "select"])).toEqual("is required!");

    // Validate rule "required naturalNumber",
    expect(validate("", ["required", "naturalNumber"])).toEqual("is required!");
    expect(validate(-1, ["required", "naturalNumber"])).toEqual("is not a valid number");
    expect(validate(0, ["required", "naturalNumber"])).toEqual("is not a valid number");
    expect(validate(1, ["required", "naturalNumber"])).toBeFalsy();
  });

  it("should display error message for invalid input in step 1", () => {
    let {next} = require('../js/index.js');

    const stepElements = document.getElementsByClassName("fw__step");
    let step1ErrorEl = stepElements[0].getElementsByClassName("fw__inputs__error");
    let step1ErrorMsgEl = step1ErrorEl[0].getElementsByClassName("fw__inputs__error--message");

    // Error message for empty First Name
    const firstnameInput = document.getElementsByName("firstname");
    firstnameInput[0].value = "";
    next();
    expect([...step1ErrorEl[0].classList].includes("hidden")).toEqual(false);
    expect(step1ErrorMsgEl[0].textContent).toEqual("First Name is required!");
    firstnameInput[0].value = "Eric";

    // Error message for empty Last Name
    const lastnameInput = document.getElementsByName("lastname");
    lastnameInput[0].value = "";
    next();
    expect([...step1ErrorEl[0].classList].includes("hidden")).toEqual(false);
    expect(step1ErrorMsgEl[0].textContent).toEqual("Last Name is required!");
    lastnameInput[0].value = "Tim";

    // Error message for either empty Email or invalid Email
    const emailInput = document.getElementsByName("email");
    emailInput[0].value = '';
    next();
    expect([...step1ErrorEl[0].classList].includes("hidden")).toEqual(false);
    expect(step1ErrorMsgEl[0].textContent).toEqual("Email is required!");
    emailInput[0].value = "test";
    next();
    expect([...step1ErrorEl[0].classList].includes("hidden")).toEqual(false);
    expect(step1ErrorMsgEl[0].textContent).toEqual("Email is invalid!");
    emailInput[0].value = "test@test.com";

    // Error message for invalid Phone
    const phoneInput = document.getElementsByName("phone");
    phoneInput[0].value = '1';
    next();
    expect([...step1ErrorEl[0].classList].includes("hidden")).toEqual(false);
    expect(step1ErrorMsgEl[0].textContent).toEqual("Phone is invalid!");
  });

  it("should proceed to step 2", () => {
    let {next} = require('../js/index.js');

    const stepElements = document.getElementsByClassName("fw__step");
    const breadcrumbsItems = document.getElementsByClassName("fw__breadcrumbs__element");

    const firstnameInput = document.getElementsByName("firstname");
    firstnameInput[0].value = "Eric";
    const lastnameInput = document.getElementsByName("lastname");
    lastnameInput[0].value = "Time";
    const emailInput = document.getElementsByName("email");
    emailInput[0].value = 'test@test.com';
    next();

    expect([...stepElements[0].classList].includes("hidden")).toEqual(true);
    expect([...stepElements[1].classList].includes("hidden")).toEqual(false);
    expect([...stepElements[2].classList].includes("hidden")).toEqual(true);

    expect([...breadcrumbsItems[0].classList].includes("fw__breadcrumbs__element--active")).toEqual(true);
    expect([...breadcrumbsItems[1].classList].includes("fw__breadcrumbs__element--active")).toEqual(true);
    expect([...breadcrumbsItems[2].classList].includes("fw__breadcrumbs__element--active")).toEqual(false);
  });

  it("should be able to go back step 1 from step 2", () => {
    let {next, back} = require('../js/index.js');

    /* proceed to step 2 */

    const stepElements = document.getElementsByClassName("fw__step");
    const breadcrumbsItems = document.getElementsByClassName("fw__breadcrumbs__element");

    const firstnameInput = document.getElementsByName("firstname");
    firstnameInput[0].value = "Eric";
    const lastnameInput = document.getElementsByName("lastname");
    lastnameInput[0].value = "Time";
    const emailInput = document.getElementsByName("email");
    emailInput[0].value = 'test@test.com';
    next();

    /* start testing back button */

    back();

    expect([...stepElements[0].classList].includes("hidden")).toEqual(false);
    expect([...stepElements[1].classList].includes("hidden")).toEqual(true);
    expect([...stepElements[2].classList].includes("hidden")).toEqual(true);

    expect([...breadcrumbsItems[0].classList].includes("fw__breadcrumbs__element--active")).toEqual(true);
    expect([...breadcrumbsItems[1].classList].includes("fw__breadcrumbs__element--active")).toEqual(false);
    expect([...breadcrumbsItems[2].classList].includes("fw__breadcrumbs__element--active")).toEqual(false);
  });

  it("should display error message for invalid input in step 2", () => {
    let {next} = require('../js/index.js');

    /* proceed to step 2 */

    const stepElements = document.getElementsByClassName("fw__step");
    const breadcrumbsItems = document.getElementsByClassName("fw__breadcrumbs__element");
    let step2ErrorEl = stepElements[1].getElementsByClassName("fw__inputs__error");
    let step2ErrorMsgEl = step2ErrorEl[0].getElementsByClassName("fw__inputs__error--message");
    const form = document.getElementById("form");
    const submitButton = document.getElementById("submit");

    const firstnameInput = document.getElementsByName("firstname");
    firstnameInput[0].value = "Eric";
    let lastnameInput = document.getElementsByName("lastname");
    lastnameInput[0].value = "Tim";
    let emailInput = document.getElementsByName("email");
    emailInput[0].value = 'test@test.com';
    next();

    /* start testing validation in step 2 */

    // Error message for empty Street Number
    const stnumberInput = document.getElementsByName("stnumber");
    stnumberInput[0].value = "";
    submitButton.click();
    expect([...step2ErrorEl[0].classList].includes("hidden")).toEqual(false);
    expect(step2ErrorMsgEl[0].textContent).toEqual("Street Number is required!");
    stnumberInput[0].value = 80;

    // Error message for empty Street Name
    const stnameInput = document.getElementsByName("stname");
    stnameInput[0].value = "";
    submitButton.click();
    expect([...step2ErrorEl[0].classList].includes("hidden")).toEqual(false);
    expect(step2ErrorMsgEl[0].textContent).toEqual("Street Name is required!");
    stnameInput[0].value = "Jephson";

    // Error message for unselected Street Type
    const sttypeInput = document.getElementsByName("sttype");
    sttypeInput[0].selectedIndex = 0;
    submitButton.click();
    expect([...step2ErrorEl[0].classList].includes("hidden")).toEqual(false);
    expect(step2ErrorMsgEl[0].textContent).toEqual("Street Type is required!");
    sttypeInput[0].selectedIndex = 3;

    // Error message for empty Suburb
    const suburbInput = document.getElementsByName("suburb");
    suburbInput[0].value = "";
    submitButton.click();
    expect([...step2ErrorEl[0].classList].includes("hidden")).toEqual(false);
    expect(step2ErrorMsgEl[0].textContent).toEqual("Suburb is required!");
    suburbInput[0].value = "Toowong";

    // Error message for Postcode
    const postcodeInput = document.getElementsByName("postcode");
    postcodeInput[0].value = "";
    submitButton.click();
    expect([...step2ErrorEl[0].classList].includes("hidden")).toEqual(false);
    expect(step2ErrorMsgEl[0].textContent).toEqual("Postcode is required!");
    postcodeInput[0].value = "0100";
    submitButton.click();
    expect([...step2ErrorEl[0].classList].includes("hidden")).toEqual(false);
    expect(step2ErrorMsgEl[0].textContent).toEqual("Postcode is invalid!");
    postcodeInput[0].value = "4066";
  });

  it("should show the completed data", () => {
    let {next} = require('../js/index.js');

    const stepElements = document.getElementsByClassName("fw__step");
    const breadcrumbsItems = document.getElementsByClassName("fw__breadcrumbs__element");
    const submitButton = document.getElementById("submit");

    const firstnameInput = document.getElementsByName("firstname");
    firstnameInput[0].value = "Eric";
    const lastnameInput = document.getElementsByName("lastname");
    lastnameInput[0].value = "Tim";
    const emailInput = document.getElementsByName("email");
    emailInput[0].value = 'test@test.com';
    const phoneInput = document.getElementsByName("phone");
    phoneInput[0].value = "0412345678";
    next();

    const stnumberInput = document.getElementsByName("stnumber");
    stnumberInput[0].value = 80;
    const stnameInput = document.getElementsByName("stname");
    stnameInput[0].value = "Jephson";
    const sttypeInput = document.getElementsByName("sttype");
    sttypeInput[0].selectedIndex = 3;
    const suburbInput = document.getElementsByName("suburb");
    suburbInput[0].value = "Toowong";
    const postcodeInput = document.getElementsByName("postcode");
    postcodeInput[0].value = "4066";
    submitButton.click();

    expect([...stepElements[0].classList].includes("hidden")).toEqual(true);
    expect([...stepElements[1].classList].includes("hidden")).toEqual(true);
    expect([...stepElements[2].classList].includes("hidden")).toEqual(false);

    expect([...breadcrumbsItems[0].classList].includes("fw__breadcrumbs__element--active")).toEqual(true);
    expect([...breadcrumbsItems[1].classList].includes("fw__breadcrumbs__element--active")).toEqual(true);
    expect([...breadcrumbsItems[2].classList].includes("fw__breadcrumbs__element--active")).toEqual(true);

    const resultValueElements = document.getElementsByClassName("fw__result__value");
    expect(resultValueElements[0].textContent).toEqual("Eric");
    expect(resultValueElements[1].textContent).toEqual("Tim");
    expect(resultValueElements[2].textContent).toEqual("test@test.com");
    expect(resultValueElements[3].textContent).toEqual("0412345678");
    expect(resultValueElements[4].textContent).toEqual("80");
    expect(resultValueElements[5].textContent).toEqual("Jephson");
    expect(resultValueElements[6].textContent).toEqual("St");
    expect(resultValueElements[7].textContent).toEqual("Toowong");
    expect(resultValueElements[8].textContent).toEqual("4066");
  });

  it("should allow user to start over", () => {
    let {next, init} = require('../js/index.js');

    const stepElements = document.getElementsByClassName("fw__step");
    const breadcrumbsItems = document.getElementsByClassName("fw__breadcrumbs__element");
    const submitButton = document.getElementById("submit");

    const firstnameInput = document.getElementsByName("firstname");
    firstnameInput[0].value = "Eric";
    const lastnameInput = document.getElementsByName("lastname");
    lastnameInput[0].value = "Tim";
    const emailInput = document.getElementsByName("email");
    emailInput[0].value = 'test@test.com';
    const phoneInput = document.getElementsByName("phone");
    phoneInput[0].value = "0412345678";
    next();

    const stnumberInput = document.getElementsByName("stnumber");
    stnumberInput[0].value = 80;
    const stnameInput = document.getElementsByName("stname");
    stnameInput[0].value = "Jephson";
    const sttypeInput = document.getElementsByName("sttype");
    sttypeInput[0].selectedIndex = 3;
    const suburbInput = document.getElementsByName("suburb");
    suburbInput[0].value = "Toowong";
    const postcodeInput = document.getElementsByName("postcode");
    postcodeInput[0].value = "4066";
    submitButton.click();

    init();
    expect([...stepElements[0].classList].includes("hidden")).toEqual(false);
    expect([...stepElements[1].classList].includes("hidden")).toEqual(true);
    expect([...stepElements[2].classList].includes("hidden")).toEqual(true);

    expect([...breadcrumbsItems[0].classList].includes("fw__breadcrumbs__element--active")).toEqual(true);
    expect([...breadcrumbsItems[1].classList].includes("fw__breadcrumbs__element--active")).toEqual(false);
    expect([...breadcrumbsItems[2].classList].includes("fw__breadcrumbs__element--active")).toEqual(false);

    expect(firstnameInput[0].value).toEqual('');
    expect(lastnameInput[0].value).toEqual('');
    expect(emailInput[0].value).toEqual('');
    expect(phoneInput[0].value).toEqual('');
    expect(stnumberInput[0].value).toEqual('');
    expect(stnameInput[0].value).toEqual('');
    expect(sttypeInput[0].value).toEqual('');
    expect(suburbInput[0].value).toEqual('');
    expect(postcodeInput[0].value).toEqual('');
  });
});

