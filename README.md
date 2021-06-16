# chatProj

<strong>ДЛЯ ЗАПУСКА ПРОЕКТА:</strong>

1. Скачайте проэкт, откройте в редакторе кода наподобии Web Storm или VS Code.
2. Откройте терминал, в корне проекта введите команду "npm i"
3. В терминале перейдите в папку client при помощи команды "cd client" и введите ту же команду "npm i" (i - сокращенно install)
4. Выйдите из папки client в исходную папку при помощи команды "cd .."
5. Введите команду "npm run dev" для запуска проекта
-------------------------------------------------------------------------------------------------------------------------------
<strong>ОПИСАНИЕ:</strong>

Для начала необходимо авторизироваться. По умолчанию будет пустой чат. Можно найти пользователя по логину и начать с ним чат. Также можно нажать на кнопку меню и перейти в настройки, где можно
изменить данные пользователя, либо выйти из аккаунта. Авторизация сделана через jwt токен, в качестве базы данных использовал MongoDB, фронт на React и сервер на Node.