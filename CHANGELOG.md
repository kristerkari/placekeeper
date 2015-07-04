1.0.5

- Fixed clone password inputs to no clone id attribute #46
- Fixed password inputs not working in IE9 #38
- Fixed handling of password inputs that have intial values #37, #44
- Fixed chaning placeholder attribute after page load #34
- Fixed changing input type after page load #30
- Fixed removing placeholder attribute #29
- Fixed caret jumping to the beginning and end when input was focused. This was because `hidePlaceholder` method was getting called even if value did not change. #28

1.0.4

- Fixed an error that was thrown when `document.documentElement` or `document.body` was `null` or `undefined`.

1.0.3

- Fixed jQuery adapter for numeric placeholder values #24

1.0.2

- No changes, forgot to build "dist" folder.

1.0.1

- Fixed placeholder for password inputs and "hide on input" mode on older browsers #19, #21
- Fixed problems with disabled inputs #18

1.0.0

- Initial release
