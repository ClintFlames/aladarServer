# AladarServer guide
Гайд на русском ([здесь](./Guide_ru.md)).
If you are looking for a guide on `aladar`, then it is [here] (https://github.com/ClintFlames/aladar/blob/main/docs/Guide.md).

<br>

### Navigation
- [Install on glitch.com](#installation-on-glitchcom) (easy way).
- [Install to host.](#installation-on-host)

<br>

## Installation on glitch.com
1. Register at [glitch.com](https://glitch.com).
2. Go to the [project page](https://glitch.com/edit/#!/aladarserver).
3. Click on the button <image alt="Remix" src="./glitch_remix.png" align="center" height="40rem">
4. Select the `config.ts` file and set `joinCode` to `"env"` and `webSocketPort` to `0`.
5. Open the `.env` file.
6. Write the secret code in the field for the `CODE` value (the code may contain the characters a-z A-Z 0-9, and must also be 8 or more in length).
7. Click on the button <image alt="Terminal" src="./glitch_terminal.png" align="center" height="40rem"> (it's on the bottom panel).
8. Type `refresh` and press `Enter`.
<br>
<image src="./glitch_refresh.png" align="center" height="80rem">


### Link to connect
1. Copy the name of the project, it is above the `Settings` button.
<br>
<image alt="Settings" src="./glitch_name.png" align="center" height="80rem">
2. Copy the secret code (the one you wrote in the `.env` file).
3. The link looks like this `wss://project name.glitch.me::secret code`.
<br>
For example `wss://aladarserver.glitch.me::joinCode`

<br>

## Installation on host