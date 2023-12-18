install dependency 

npm install --save grenache-nodejs-ws grenache-nodejs-link grenache-grape

run two server instance

DEBUG=* npx grape --dp 20001 --dc 32 --aph 30001 --bn '127.0.0.1:20001'
DEBUG=* npx grape --dp 20002 --dc 32 --aph 40001 --bn '127.0.0.1:20002'


run the project
npx ts-node src/main.ts 


