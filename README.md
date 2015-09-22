# nodelist-ffm
[Freifunk München](https://github.com/freifunkMUC) node list

## Build
If you are a web dev wiz, you could probably go with:
```
npm install
bower install
grunt
```

All others creatures probably want to install `npm` with their favourite distro's package manager.
This program can sometimes be found in the `nodejs` package.
After that, they can run the following:
```
npm install
npm install bower grunt-cli
node_modules/.bin/bower install
node_modules/.bin/grunt
```

During development. `grunt serve` resp. `node_modules/.bin/grunt serve` comes in handy.

## ToDo
- [X] Procrastinate
- [ ] Wait for w2ui 1.4.3 successor release (includes bug fix)
- [X] Use bower for libs
- [ ] Use site configuration file
- [X] Use grunt/what ever to compile everything into one small file
- [ ] More columns
  - [ ] Link Quality
  - [ ] IPs (with links)
  - [ ] "Has location"
  - [ ] Fancy icons who show a lot of different informations at once (online? + has VPN? + ...)
- [ ] Honour libs in about
- [ ] Async data loading
- [ ] Automatic/manual reloading
- [ ] Freifunk design

## Contribute
Please try to stick to the coding style.

Don't hesitate to send a pull request. Seriously. Just do it!

Questions? Ask [Skruppy](https://github.com/Skruppy).
