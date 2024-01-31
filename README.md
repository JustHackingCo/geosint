# geosint
A CTF-style Geo OSINT website in the style of GeoGuessr from [JustHackingCo](https://github.com/JustHackingCo/geosint). Modified to utilize docker secrets, pull missing panorama ids from lat/lng, and utilize docker compose. 

## Pulling Panorama Tiles
A big difference in how GeoGuessr runs things is how the panorama (Street View) is built. A normal sane person would just call the Google Maps JavaScript API, which runs on client-side, to gather the tiles and build the panorama all at once. The big issue there is that the user can easily fish the `panoId` from the network traffic. We don't want any cheaters around these parts :cowboy:.

So instead, we can use `pull_challs.js` or `pull_challs_fast.js` which will query Google for the tile images and save them to `./public/img/chall*/` for all challenge information specified in `challs.json`.

**NOTE:** `pull_challs_fast.js` is MUCH faster than `pull_challs.js`, however it uses a lot of memory. Depending on your internet speed, `pull_challs_fast.js` takes about 30 seconds and `pull_challs.js` takes about 7 minutes.

## Files to modify
To create new challenges modify the `challenges.yml` file.
```yaml
Category:
  ChallengeName:
    panoType: # More than likely kept at 1
    pano: # Panorama ID if known if not null
    lat: # Latitude for street view
    lng: # Longitude for street view
    maxZ: # 1-5 are valid options
    flag: # The flag for successfully completing challenge
    flag_file: # The file containing 
    img: # The tile image to display
```

## Deployment
The only requirement is passing a build argument of MAPS_API_KEY which is the Google maps api key to allow access for panorama retrieval and instantiation of the google maps widgets.

```shell
export MAPS_API_KEY=<key>
docker compose up --build -d
```
or 
```shell
docker compose up --build --build-arg MAPS_API_KEY=<key> -d
```

If using flag files and would like to pass in via secrets, ensure to run `docker swarm init`. 

### Shoutout
Shoutout to:
- [bensizelove](https://github.com/bensizelove/geoguessr)
- [JustHackingCo](https://github.com/JustHackingCo/geosint)