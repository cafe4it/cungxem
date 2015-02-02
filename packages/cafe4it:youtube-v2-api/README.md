# Youtube Api V2

## Installation

```sh
meteor add cafe4it:youtube-v2-api

```

## Documentation

You can find the docs for the API of this client at
[https://github.com/fvdm/nodejs-youtube]https://github.com/fvdm/nodejs-youtube

## Example (Server-side)

```javascript
YoutubeApiV2.httpProtocol = 'https';
YoutubeApiV2.feeds.videos( {q:'keywords'}, callback );

```