- Не забываем создать себе .gitignor
- Устанавливаем все зависимости проекта командой npm install
- Запускаем Gulp командой gulp
- Для удаления (и пересборки) папки build пишем команду npm gulp clean
- Для очистки кеша (картинок) пишем команду gulp clear-cache
- ВАЖНО - для более "жёсткой" индентации найти и открыть файл \node_modules\js-beautify\js\lib\beautify-html.js в нём находим через поиск по строке "span" блок с тэгами, которые преттифай исключает для переноса строк. Удаляем теги "span", "img", "a", "input", "label", "select", "ul", "li" и т.д.

(WINDOWS) Если gulp-sass не устанавливается, и говорит об ошибке в C++ - то пишем следующую команду:
npm install --global --production windows-build-tools