# nodelist-ffm
A [Freifunk](https://freifunk.net) [node list](https://github.com/freifunkMUC/nodelist) by [Freifunk München](https://ffmuc.net). [Live-Demo](https://onmars.eu/ffmuc/list/)

## Build [![Build Status](https://travis-ci.org/freifunkMUC/nodelist.svg?branch=master)](https://travis-ci.org/freifunkMUC/nodelist)
Copy one of the `config.js.*` to `app/scripts/config.js` or create your own config file.
Rermember to set `downstreamSource` if you modify the source.

To build this project, you need the `npm` programm.
You can install it with your favourite distro's package manager.
This program can sometimes be found in the `nodejs` package.

After that, you can run `npm run build` to build the project into the `dist` directory.
The created content in `dist` can then be statically served by your favourite webserver.

It would be nice, if add yourself to the [list of instances](#instances).

During development. `npm run serve:dev` and `npm run serve:dist` comes in handy.


## ToDo
- [X] Procrastinate
- [X] Wait for w2ui 1.4.3 successor release (includes bug fix)
- [X] Use bower for libs
- [X] Use site configuration file
- [X] Use grunt/what ever to compile everything into one small file
- [ ] More columns
  - [ ] Link Quality
  - [X] IPs (with links)
  - [X] "Has location"
  - [ ] Fancy icons who show a lot of different informations at once (online? + has VPN? + ...)
  - [ ] Link to stats
- [X] Honour libs in about
- [ ] Async data loading
- [ ] Automatic/manual reloading
- [ ] Freifunk design
- [ ] Use JS Modules
- [ ] Make default visibility of columns configurable
- [ ] Better solution for About button workaround


## Contribute
Please try to stick to the coding style.

Don't hesitate to send a pull request. Seriously. Just do it!

Questions? Ask [Skruppy](https://github.com/Skrupellos).


## Instances
| Community/Instance name         | Instance link                                                           | Source/patches/repo link |
| ---                             | ---                                                                     | ---  |
| Freifunk Aachen                 | [Instance](https://map.aachen.freifunk.net/nodelist/)                   | |
| Freifunk Altdorf                | [Instance](https://nodelist.tecff.de/)                                  | [Source](https://github.com/tecff/nodelist) |
| Freifunk Bad Griesbach          | [Instance](http://nodelist.griesbach.freifunk.tk/)                      | [Source](http://nodelist.griesbach.freifunk.tk/dir/) |
| Freifunk Möhne Arnsberg         | [Instance](https://www.freifunk-moehne.de/knotenliste/arnsberg/)        | |
| Freifunk Möhne Balve-Kierspe    | [Instance](https://www.freifunk-moehne.de/knotenliste/balvekierspe/)    | |
| Freifunk Möhne Biggesee         | [Instance](https://www.freifunk-moehne.de/knotenliste/biggesee/)        | |
| Freifunk Möhne Meschede/Bestwig | [Instance](https://www.freifunk-moehne.de/knotenliste/meschedebestwig/) | |
| Freifunk Möhne Möhnesee         | [Instance](https://www.freifunk-moehne.de/knotenliste/moehnesee/)       | |
| Freifunk Möhne Soest            | [Instance](https://www.freifunk-moehne.de/knotenliste/soest/)           | |
| Freifunk Möhne Soester Umland   | [Instance](https://www.freifunk-moehne.de/knotenliste/soesterumland/)   | |
| Freifunk Möhne Sundern          | [Instance](https://www.freifunk-moehne.de/knotenliste/sundern/)         | |
| Freifunk Möhne Warstein         | [Instance](https://www.freifunk-moehne.de/knotenliste/warstein/)        | |
| Freifunk München                | [Instance](https://onmars.eu/ffmuc/list/)                               | [Source](https://github.com/freifunkMUC/nodelist) |
| Freifunk Nord                   | [Instance](https://mesh.nord.freifunk.net/nodelist/)                    | [Source](https://github.com/Freifunk-Nord/nord-nodelist-config) |
