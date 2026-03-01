Twice now I have encountered super fun programming problems that demand I find a function that produces a known repeating pattern. One instance was my donut.c project where I needed a frame buffer for rudimentary in-terminal graphics. The second was my circuit tutor project where I needed a simple algorithm to lay out basic electrical circuits.

A for loop's index naturally increments: `0 1 2 3 4 5 6 7 8`. This short post explains how one may make these indices produce sequences like:

- `0 0 0 1 1 1 2 2 2 3 3 3 4 4 4`
- `0 -1 2 -3 4 -5 6 -7`
- `0 -1 1 -2 2 -3 3 -4 4 -5 5`
- `0 1 2 3 0 1 2 3`

Each subpattern in the result is produced by a distinct mathematical operation:

- "shelving" (my term) `000111222333` --> floor division
- cycling `012301230123` --> modulo arithmetic
- sign flipping `0,-1,2,-3,4,-5` --> raise (-1) to the i-th power
- shifting --> add or subtract a constant

The fun part: you multiply these operations to compose more complex patterns. Example: The sequence `0 -1 1 -2 2 -3 3 -4 4` is produced by stacking a shelf with a sign flip. It's `floor((i+1) / 2) * (-1)^i`. This is the sequence I needed to lay out a ladder of resistors in my circuit tutor application.

So, to reverse-engineer the function of a pattern, decompose it into its sub-patterns, and add the requisite operator. Is there a sign flipping? Add a `(-1)^(i)`. Is there shelving too? Add a floor operation.
