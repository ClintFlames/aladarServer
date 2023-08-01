# AladarServer гайд
English guide is ([here](./Guide.md)).
Если вы ищите гайд по `aladar` то он [тут](https://github.com/ClintFlames/aladar/blob/main/docs/Guide_ru.md).

<br>

### Навигация
- [Установка на glitch.com](#установка-на-glitchcom) (простой способ).
- [Установка на хост.](#установка-на-хост)

<br>

## Установка на glitch.com
1. Зарегистрируйтесь на [glitch.com](https://glitch.com).
2. Перейдите на [страницу проекта](https://glitch.com/edit/#!/aladarserver).
3. Нажмите на кнопку <image alt="Remix" src="./glitch_remix.png" align="center" height="40rem">
4. Выберите файл `config.ts` и установите `joinCode` значение `"env"`, а `webSocketPort` значение `0`.
5. Откройте файл `.env`.
6. Запишите секректный код в поле для значения `CODE`.
7. Нажмите на кнопку <image alt="Terminal" src="./glitch_terminal.png" align="center" height="40rem">
8. Напишите `refresh` и нажмите `Enter`.
<br>
<image src="./glitch_refresh.png" align="center" height="80rem">


### Ссылка для подключения
1. Скопируйте название проекта оно находится над кнопкой `Settings`.
<br>
<image alt="Settings" src="./glitch_name.png" align="center" height="80rem">
2. Скопируйте секретный код (тот что вы записали в файл `.env`).
3. Ссылка выглядит так `wss://название проекта.glitch.me::секретный код`.
<br>
Например `wss://aladarserver.glitch.me::joinCode`

<br>

## Установка на хост