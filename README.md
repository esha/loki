First, install NodeJS (should come with NPM, might be easier to install with NVM)
Then run these commands:
```
git clone git@github.com:esha/loki.git
cd loki
npm install
npm install -g grunt-cli
grunt
grunt server
```

To change the project, edit the html/css/js files in /app
If ```grunt server``` is running, it will update the application and reload the browser.
You don't have to have ```grunt server``` running though, you can deploy the files in /dist anyway you like.
