# Getting Started

## Install Dependencies

To run this project, you need to install the required dependencies. Open your terminal and run the following command:

```bash
npm install --save grenache-nodejs-ws grenache-nodejs-link grenache-grape
```
## Run Two Server Instances

Run two Grape servers to handle the communication between the nodes. Open two separate terminal windows and execute the following commands:

```bash
DEBUG=* npx grape --dp 20001 --dc 32 --aph 30001 --bn '127.0.0.1:20001'
DEBUG=* npx grape --dp 20002 --dc 32 --aph 40001 --bn '127.0.0.1:20002'
```

## Run the Project
Now that the servers are running, execute the project by running the following command:

```bash
npx ts-node src/main.ts 
```

