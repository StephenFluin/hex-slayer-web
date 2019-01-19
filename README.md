# HexSLayer Web
This is a port of a [game I made in python](https://github.com/stephenfluin/hexslayer/) 7+ years ago. I'm hoping the interface will be better (scale to more resolutions and more devices), and the game logic will be cleaner and more maintainable. I also hope to build online multiplayer some day.

## Playing
Try the preview build here: 

[https://stephenfluin.github.io/hex-slayer-web/](https://stephenfluin.github.io/hex-slayer-web/)

You'll need to advance turns, click on realms, buy villagers (drag them from the store to your region), and then conquer territory.

### Status
As of 2019-01 this game **doesn't work yet**. The map exists and has some logic. You can click on tiles and the store shows up, but you can't attack or defend yet.


## Developing
1. Setup with `yarn`
1. Serve with `yarn start`
1. Build with `ng build --prod`

### Grid System
x and y are logical positions
x means tile in column x
y means tile in row y
