module.user
===========


##Register form contribution
Add to metadata
```js
user: {
  contributions: {
    registerForm: {
      identifier: {
        titleKey: string;
        component: {
          resolve: "component",
          value: string;
        },
      },
      ...
    }
  }
}
```
- identifer: replace this with a unique identifier with meaning to your contribution
  - titleKey: i18next localization key shown in the panel title
  - component: Component to render in the panel
    - value: Component name at path `/components/name`

###Component interface
####Methods
- onUserCreated(id: number, callback: (err: string) => void): Called once the user is correctly created
  - id: id of the newly created user
  - callback: function to callback once treatment is over. Any call to `onUserCreated` should succeeded. In the event it fails, return an error message to the callback to be shown to the user. It won't, however, stop user creation.
- onEnterFocus(): optionnal method when focusing the panel with this component

####Properties
- checkGoingUpDownKey: function to put on single input to move to previous or next panel on key down
- checkGoingUpKey: function to put on first input to move to previous panel
- checkGoingDownKey: function to put on last input to move to next panel
