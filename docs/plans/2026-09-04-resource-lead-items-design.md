# Resource Lead Items Design

## Goal

Apply the `resource-item--lead` class to the first and fourth resource
items (zero-based indexes 0 and 3).

## Approach

Keep the existing Angular class binding and change its predicate to:

```html
index === 0 || index === 3
```

This is the smallest change, preserves the current markup and styling
behavior, and avoids changing the resource data model.

## Validation

Verify the template contains the updated predicate and run the project's
available validation command if one is defined.
