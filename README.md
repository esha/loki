First, install NodeJS (should come with NPM, might be easier to install with NVM)
Then install the Heroku Toolbelt: https://toolbelt.heroku.com/
Then run these commands:
```
git clone git@github.com:esha/loki.git
cd wsdemo
npm install
grunt
foreman start -d dist
```

To change the project, edit the html/css/js files in /app.
Whenever you make a change, rebuild and restart by doing:
```grunt && foreman start -d dist```

If you would like to deploy the app to Heroku, you must create your own Heroku app with:  
```heroku apps:create myappname```
and then deploy the app with  
```git subtree push --prefix dist heroku master```
