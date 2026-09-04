# Remove Header Brand Mark Design

## Scope

Remove the conditional `brand-mark` element from the site header template and
remove only the CSS rule and explanatory text that exist solely for that
element.

## Preserved behavior

Keep the `concept()` input, `site-header--c` class, concept-b navigation
markup, and their remaining styles because they are independently used by the
header.

## Validation

Search the header component for remaining `brand-mark` references, then run
the project's existing build to verify the Angular template and styles still
compile.
