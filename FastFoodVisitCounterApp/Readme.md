Steps to Run
1. You need to install expo-cli by "npm install -g expo-cli"
1. Go to Project root and run "npm install", it will install all dependencies for client.
2. Then go inside server folder and run "npm install", for installing all dependencies for server.
3. Then inside the server folder, run "node server.js". This starts the server for you.
4. Then go to root folder and run "expo start --android" to run the app. 

Extra Steps:
1. Allow port 5000 to be used externally. In linux you can do that using sudo ufw allow 5000/tcp
2. Go to App.js and replace the "ip address" with your own "ip".
