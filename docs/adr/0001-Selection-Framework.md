# Choose selection framework

**User Story:** #27

During the implementation of `Clicking on a tag should search for it` (issue #27) we noticed that we could not get the value of the
tag into the elements in the GUI.
We needed a framework that allowed to add values to the elements via code.
Thus `angular2-select` is deprecated.

## Considered Alternatives

- angular2-select
- ng2-select
- ng2-select-custom

## Decision Outcome

`ng2-select`

Because it allows adding selected items programmatically.

## Pros and Cons of Alternatives

### `angular2-select`

* Does not allow adding elements programmatically

### `ng2-select`

* Does allow adding elements programmatically

### `ng2-select-custom`

* Does allow adding elements programmatically
* Is a fork of ng2-select