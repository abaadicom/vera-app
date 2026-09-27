const CACHE_NAME =
  'vera-v200';

const APP_FILES = [
  './',
  './index.html',
  './styles.css?v=200',
  './app.js?v=200',
  './manifest.webmanifest?v=200',
  './vera_icon.png?v=200'
];

self.addEventListener(
  'install',
  event => {

    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then(
          cache =>
            cache.addAll(
              APP_FILES
            )
        )
    );

    self.skipWaiting();
  }
);


self.addEventListener(
  'activate',
  event => {

    event.waitUntil(

      caches
        .keys()
        .then(
          keys =>
            Promise.all(

              keys
                .filter(
                  key =>
                    key !==
                    CACHE_NAME
                )
                .map(
                  key =>
                    caches.delete(
                      key
                    )
                )

            )
        )

    );

    self.clients.claim();
  }
);


self.addEventListener(
  'fetch',
  event => {

    if (
      event.request.method !==
      'GET'
    ) {
      return;
    }

    event.respondWith(

      fetch(
        event.request
      )

        .then(
          response => {

            const copy =
              response.clone();

            caches
              .open(
                CACHE_NAME
              )
              .then(
                cache =>
                  cache.put(
                    event.request,
                    copy
                  )
              );

            return response;
          }
        )

        .catch(
          () =>
            caches.match(
              event.request
            )
        )

    );
  }
);
