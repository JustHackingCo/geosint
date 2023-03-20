# geosint
A CTF-style Geo OSINT website in the style of GeoGuessr

**NOTE:** Still working on home page design

## Pulling Panorama Tiles
A big difference in how GeoGuessr runs things is how the panorama (Street View) is built. A normal sane person would just call the Google Maps JavaScript API, which runs on client-side, to gather the tiles and build the panorama all at once. The big issue there is that the user can easily fish the `panoId` from the network traffic. We don't want any cheaters around these parts :cowboy:.

So instead, we can use `pull_challs.js` or `pull_challs_fast.js` which will query Google for the tile images and save them to `./img/chall*/` for all challenge information specified in `challs.json`.

**NOTE:** `pull_challs_fast.js` is MUCH faster than `pull_challs.js`, however it uses a lot of memory. Depending on your internet speed, `pull_challs_fast.js` takes about 30 seconds and `pull_challs.js` takes about 7 minutes.

```sh
$ npm install node-fetch@2
$ mkdir ./img/chall1 ./img/chall2 # however many challs you have
$ node pull_challs.js # OR do the fast one if you are sane and have unlimited memory
```

## Docker Build
Build the NodeJs image
```
docker build -t geosint .
```

Run the image
```
docker run -p 8080:6958 geosint
```

### Node Packages
```
npm install body-parser cookie-parser express jsdom node-fetch
```

### Shoutout
Shoutout to [bensizelove](https://github.com/bensizelove/geoguessr)
