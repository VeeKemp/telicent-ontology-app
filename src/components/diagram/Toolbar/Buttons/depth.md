# RE: Depth 4
Deviation from https://github.com/telicent-oss/docs/blob/main/fe/guild/decisions/file-folder-structure.md

Before refactoring:
* `/Toolbar` was on `/components`.

While refactoring:
* We created `/components/diagram` to give more clarity to diagram components
* It really made sense to put `/Toobar` within it.
* Ash didn't want to flatten `/Toolbar` as it was pre-existing code, and made good sense.