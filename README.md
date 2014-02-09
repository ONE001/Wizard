Wizard
==========

This is a simple javascript plugin which was made on plain javascript.

Do not need any dependencies.

## Usage

``` html
  <link href="lib/wizard.css" rel="stylesheet" type="text/css"/>
  <script src="lib/wizard.js" type="text/javascript"></script>
```

To create an object Wizard, you need to call the Wizard (as you wish with or without operator 'new') and pass the first argument as object, which includes following keys:

    element - HTMLElement, there will be inserted components of wizard. If you omit this parameter will return the Wizard HTMLElement, which is not in the DOM tree.

    steps_panel - boolean flag that says show all possible steps of wizard. True by default

    active - ​​Int, number of active step during the initialization wizard. 1 by default

    history - boolean flag , by default false, if set to true, the steps of the wizard will be stored in history and can be pressed back to go to the previous step.

    finish - callback, to be called after a successful passage through the steps of the wizard.

    steps - Array with Objects inside. Each object is a step of the wizard. Each object contains the following keys (none of these is not required):

        title - String, header step. Displayed in steps_panel
    
        body - String, any text that will be inserted in this step of the wizard in the body (may have tags)
    
        init - function, callback that is called after the step is created, takes two arguments - the step number and section, which is a HTMLElement and contains the current step
    
        next - function, callback is invoked by pressing the button next. Takes one argument - the number of steps. It should return true to take the next step.

On each callback you can use this.data.set and this.data.get to set/get any data between steps

For more information look into index.html
