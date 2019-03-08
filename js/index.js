let stepIndex = 0;
const stepElements = document.getElementsByClassName("fw__step");
const breadcrumbsItems = document.getElementsByClassName("fw__breadcrumbs__element");
const form = document.getElementById("form");

// Initialise the form
function init() {
  // Reset the step
  stepIndex = 0;
  // Clear all fields
  form.reset();
  toggleBreadcrumbsStep();
  showCurrentStep();

  const errorEl = document.getElementsByClassName("fw__inputs__error");
  // Remove all error messages
  Array.from(errorEl).forEach(function (el, index) {
    el.classList.add("hidden");
    el.getElementsByClassName("fw__inputs__error--message")[0].innerHTML = "";
  });
}

// Indicate the current step with breadcrumbs
function toggleBreadcrumbsStep() {
  Array.from(breadcrumbsItems).forEach(function (el, index) {
    if (index <= stepIndex) {
      el.classList.add("fw__breadcrumbs__element--active");
    } else {
      el.classList.remove("fw__breadcrumbs__element--active");
    }
  });
}

// Show the current step and hide the rest
function showCurrentStep() {
  Array.from(stepElements).forEach(function (el, index) {
    if (index !== stepIndex) {
      el.classList.add("hidden");
    } else {
      el.classList.remove("hidden");
    }
  });
}

// Next step action, all fields in current step must be validated before proceed to next step.
function next() {
  const fields = stepElements[stepIndex].querySelectorAll("input:not([type=button]):not([type=submit]), select");
  const error = validateFields(fields);

  if (!error) {
    // Increment step
    stepIndex++;
    toggleBreadcrumbsStep();
    showCurrentStep();
  }
}

// Back button action to navigate 1 step back
function back() {
  // Clear all fields in current step
  const fields = stepElements[stepIndex].querySelectorAll("input:not([type=button]):not([type=submit]), select");
  Array.from(fields).forEach(function (field) {
    const tagName = field.tagName;
    if (tagName.localeCompare("INPUT") === 0) {
      field.value = '';
    } else if (tagName.localeCompare("SELECT") === 0) {
      field.selectedIndex = 0;
    }
  });

  // Decrement step
  stepIndex--;
  toggleBreadcrumbsStep();
  showCurrentStep();
}


form.addEventListener('submit', function (e) {
  e.preventDefault();

  const fields = stepElements[stepIndex].querySelectorAll("input:not([type=button]):not([type=submit]), select");
  // all fields in current step must be validated before submission.
  const error = validateFields(fields);

  if (!error) {
    // Prepare the result in next view
    showResult();
    // Navigate to result
    stepIndex++;
    toggleBreadcrumbsStep();
    showCurrentStep();
  }
}, false);

const validations = {
  required: function (val) {
    return val !== '' ? false : "is required!";
  },

  phone: function (val) {
    return val.match(/(?:\+?61)?(?:\(0\)[23478]|\(?0?[23478]\)?)\d{8}/) ? false : "is invalid!";
  },

  email: function (val) {
    return val.match(/^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/) ? false : "is invalid!";
  },

  /**
   * Postcode must be in the inclusive range of 0800-7999
   * @param val Postcode to validate
   * @returns all matchs in Array object, null otherwise
   */
  postcode: function (val) {
    return val.match(/^([0][8-9][0-9][0-9]|[1-7][0-9][0-9][0-9])$/) ? false : "is invalid!";
  },

  naturalNumber: function (val) {
    return !isNaN(val) && Number.isInteger(parseInt(val)) && val > 0 ? false : "is not a valid number";
  },

  select: function (selectedIndex) {
    return selectedIndex !== 0 ? false : "is required";
  }
};

/**
 * Validate provided value
 * @param value Value in the input field to validate
 * @param rules Validation types define the method of validation
 * @returns Error message if error occurred, null otherwise.
 */
function validate(value, rules) {
  let error = null;

  rules.find(function (rule) {
    if (rule.localeCompare("required") === 0) {
      error = validations[rule](value);
    } else if (value !== '') {
      error = validations[rule](value);
    }

    return error;
  });

  return error;
}

/**
 * Validate all fields in step and display the corresponding error
 * @param fields All fields in current step to validate
 * @returns {*} Error message if any error occurred. Only the message from the first error found will be shown. Return null if no error found.
 */
function validateFields(fields) {
  let error = null;
  Array.from(fields).find(function (field, index) {
    const fieldLabel = field.getAttribute("data-label");
    // Get all validation types
    let rules = field.getAttribute("data-validation");
    rules = rules ? rules.split(' ') : '';
    // Value to validate
    let value = (field.tagName.localeCompare("SELECT") === 0) ? field.selectedIndex : field.value;

    error = validate(value, rules);
    error = error ? fieldLabel + ' ' + error : error;

    return error;
  });

  let errorEl, errorMsgEl;
  errorEl = stepElements[stepIndex].getElementsByClassName("fw__inputs__error");
  if (errorEl && errorEl.length > 0) {
    errorMsgEl = errorEl[0].getElementsByClassName("fw__inputs__error--message");
  }

  if (error) {
    //Set error message
    if (errorEl && errorEl.length > 0) {
      errorEl[0].classList.remove("hidden");
    }

    if (errorMsgEl && errorMsgEl.length > 0) {
      errorMsgEl[0].innerHTML = error;
    }
  } else {
    //Remove error message
    if (errorEl && errorEl.length > 0) {
      errorEl[0].classList.add("hidden");
    }

    if (errorMsgEl && errorMsgEl.length > 0) {
      errorMsgEl[0].innerHTML = '';
    }
  }

  return error;
}

function showResult() {
  const resultsContainer = document.getElementById("results");
  // Make sure the result page is empty
  resultsContainer.innerHTML = "";

  const fields = form.querySelectorAll("input:not([type=button]):not([type=submit]), select");

  // List out all data
  fields.forEach(field => {
    const fieldLabel = field.getAttribute("data-label");
    const fieldValue = field.value;

    const resultItem = document.createElement("div");
    resultItem.setAttribute("class", "fw__result__item");
    resultItem.innerHTML = '<p class="fw__result__label">' + fieldLabel + '</p><span class="fw__result__value">' + fieldValue + '</span>';

    resultsContainer.append(resultItem);
  });
}

init();
