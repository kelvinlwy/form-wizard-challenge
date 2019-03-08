### Multi Stage Form Wizard Challenge
---

Compare the Market has many applications that manage mutli-stage forms. We would like to you build a multi-stage form wizard that presents that data back upon completion.

### Requirements

The requirements are as follows:

* A basic two-step form
* Form 1 contains the following form fields:
    * First name (required)
    * Last name (required)
    * Email (required)
    * Phone (optional)
* Form 2 contains the following form fields:
    * Street Number (required)
    * Street Name (required)
    * Street Type (required)
    * Suburb (required)
    * Postcode (required)
* Email and Phone must validate against expected formats
* Postcode must be in the inclusive range of 0800-7999
* Street number must be a valid number
* Street type must be a dropdown of the following values
    * Cl
    * Ct
    * St
    * Pl
    * Ave
* A progress bar must be displayed based on the number of steps completed/remaining
* A button to progress to the next step must be displayed
* Upon completion of the final step, the completed data must be displayed back to the user
* Style it however you want, either default or with your own flavour

### Rules

Some rules to follow:

* Vanilla JavaScript only
    * No frameworks
    * No dependencies except for a testing library
* Must work in latest Chrome, Firefox and Edge
    * Note: If you need a VM to test Edge, visit [here](https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/)
* No polyfills
* Unit testing is required
    * Browser testing is optional
* Code must be version controlled
* Result must be returned in .zip format, including source controlled files (e.g. .git).
