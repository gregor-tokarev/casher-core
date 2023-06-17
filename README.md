
<h1 style="text-align: center">
CASHER
</h1>

casher - is headless platform for making you own highly customizable e-commerce store
friendly for developers and business owners

### Installation guide
1. Clone project `git clone git@github.com:gregor-tokarev/casher-core.git`

2. Services needed for casher work.

This is:
1. Mino object storage
2. Postgresql db 
3. Elastic search
4. Kibana

You can setup it by your own, on different machines.
Or just run `docker compose up -d` in the root of project.
Copy env file `cp .local.env .env` and pass all variables

3. Run migrations
`npm run typeorm:run`
4. build project
`npm run build`
5. Start it
`npm run start:prod`

PROFIT!!
