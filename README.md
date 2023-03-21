# geosint
A CTF-style Geo OSINT website in the style of GeoGuessr

**NOTE:** Still working on home page design

## Pulling Panorama Tiles
A big difference in how GeoGuessr runs things is how the panorama (Street View) is built. A normal sane person would just call the Google Maps JavaScript API, which runs on client-side, to gather the tiles and build the panorama all at once. The big issue there is that the user can easily fish the `panoId` from the network traffic. We don't want any cheaters around these parts :cowboy:.

So instead, we can use `pull_challs.js` or `pull_challs_fast.js` which will query Google for the tile images and save them to `./public/img/chall*/` for all challenge information specified in `challs.json`.

**NOTE:** `pull_challs_fast.js` is MUCH faster than `pull_challs.js`, however it uses a lot of memory. Depending on your internet speed, `pull_challs_fast.js` takes about 30 seconds and `pull_challs.js` takes about 7 minutes.

```sh
$ npm install node-fetch@2
$ mkdir ./public/img/chall1 ./public/img/chall2 # however many challs you have
$ node pull_challs.js # OR do the fast one if you are sane and have unlimited memory
```

## Files to modify
If you would like to change the locations, you can do so by changing the below files. Check out the example files for more details.

### challs.json
This private file stores the challenge secret information that is used by `server.js`, `pull_challs.js`, and `pull_challs_fast.js`.
```
{
        <chall_name>: {"pano": <panorama ID>, "lat": <latitude>, "lng": <longitude>, "maxZ": <max zoom [1-5]>, "flag": <flag for challenge>},
	...
}
```

### public/info.json
This file is optional, however it can be helpful in specifying panorama width and height for those panoramas that overlap and look weird. The start of the `initialize()` function in `public/js/chall.js` uses this file.
```
{
        <chall_name>: {"width": int, "height": int}
}
```

## Docker Build
Build the NodeJs image
```sh
docker build -t geosint .
```

*NOTE:* The docker build automatically runs `pull_challs.js`

Run the image
```sh
docker run -p 443:6958 -d geosint
```


### Node Packages
```sh
npm install body-parser cookie-parser express node-fetch@2
```

### Shoutout
Shoutout to [bensizelove](https://github.com/bensizelove/geoguessr)
