# char-count-pr-comment

GitHub Action to count the number of characters and comment on a pull request

## Inputs

### `token`

**Required** The GitHub Token to create a comment on a pull request.

### `files`

**Required** A list of files, and wildcard patterns to count the number of characters. See [@actions/glob](https://github.com/actions/toolkit/tree/master/packages/glob) for supported patterns.

## Example Usage

```yaml
on:
  pull_request:
    paths:
      - "articles/**/*.md"

jobs:
  char-count:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 12.x
      - uses: miyajan/char-count-pr-comment@v1.0.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          patterns: articles/**/*.md
```
