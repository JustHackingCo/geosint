# geosint
A CTF-style Geo OSINT website in the style of GeoGuessr

**NOTE:** Still working on home page design

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
