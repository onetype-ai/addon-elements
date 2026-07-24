# TODO

## Formatters move out (planned addon: formatters, probably shipped with the ui package)

Elements used to carry a display-formatter system for table cells and column values. It was removed on Jul 24 2026 to keep elements a pure element registry and rendering engine. This is the context for rebuilding it as its own addon.

### What it was

A family of `make.*` functions, each turning `(column, item)` into an HTML string for one display type:

`text`, `number`, `date`, `timeago`, `currency`, `boolean`, `badge`, `chip`, `tag`, `tags`, `status`, `count`, `metric`, `progress`, `avatar`, `icon`, `image`, `media`, `link`, `color`, `description`, `escape`, `group`.

Support functions: `make.format.number`, `make.format.date`, `make.format.currency`, `make.format.timeago` (raw value to string), `get.colors.badge` and `get.colors.status` (name to color class), `make.escape` (HTML escaping used by the text types).

### How it worked

- Entry point `make.render(column, item)`: `column.render` callback wins when present; otherwise dispatch by `column.type` and fall back to `make.text`.
- `make.group` composed nested columns: `config.fields` array rendered through `make.render` into a `.ot-type-group` wrapper with `layout-row/column` and `gap-*` classes.
- Every formatter read its options from `column.config` (for example currency code, date format, progress max) and the value from `item[column.field]`.
- `front/styles/types.css` carried the `.ot-type-*` classes for badges, chips, statuses, progress bars and group layouts. The stylesheet moved out together with the functions.

### Known bug at removal time

`make.render` dispatched to `elements.Fn('type.' + type)` but the functions were registered as `make.<type>`, so the dispatch never matched and everything fell back to `make.text`. The formatters addon should register the family under one consistent namespace and dispatch against it.

### Consumers

None at removal time. The admin grid (`packages/admin` table fields) has its own field rendering and is the natural first consumer of the future addon.
