const fs = require('fs');
const Web3 = require('web3');
const solc = require('solc');
const pasync = require('pasync');
const solidity = require('../config/solidity.config');

// connect to the test net
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const web3 = new Web3(new Web3.providers.HttpProvider(solidity.host));
const act0 = web3.eth.accounts[0];
const act1 = web3.eth.accounts[1];
const act2 = web3.eth.accounts[2];

// const debug = require('debug')('app:config:project')

module.exports = {
  compile: () => {
    return Promise.resolve()
      .then(() => {
        const contracts = {};
        // get all files
        const code = fs.readFileSync(`${__dirname}/contracts/Terrapin.sol`).toString();
        const output = solc.compile({sources: {
          'terrapin': code
        }}, 1);
        return pasync.eachSeries(Object.keys(output.contracts), (contractName) => {
          const { interface: abi, bytecode } = output.contracts[contractName];
          let MyContract = web3.eth.contract(JSON.parse(abi));
          return new Promise((res, rej) => {
            // only create an instance of the master contract
            if (contractName !== 'terrapin:EventManager') {
              contracts[contractName] = {
                abi: JSON.parse(abi)
              };
              return res();
            }
            MyContract.new([], {
              data: bytecode, // date is the bytecode
              from: act2, // you will need to unlock this account to transact from it
              gas: 4476768
            }, (err, deployed) => {
              if (err) return rej(err);
              if (!deployed.address) return; // waiting for this contract to be mined

              // save the deployed address and ABI to get a reference when the front end is deployed
              contracts[contractName] = {
                abi: deployed.abi,
                address: deployed.address
              }
              res();
            });
          });
        })
        .then(() => {
          process.env.CONTRACTS = JSON.stringify(contracts)
          return contracts
        });
      });
  }
}
