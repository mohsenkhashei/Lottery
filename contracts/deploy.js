const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const contractFile = require('./compile');
const fs = require('fs');
const abi = contractFile.abi;
const bytecode = contractFile.evm.bytecode.object;

const provider = new HDWalletProvider(
	// "APP_METAMASK_CODE": "pluck when exercise enforce random knee peace abstract survey during stay code",
	// "APP_INFURA_ROPSTEN_URL": "https://ropsten.infura.io/v3/3dae85a4293e49a198ccd310221001e9"
	process.APP_METAMASK_CODE,
	// remember to change this to your own phrase!
	/* This is the endpoint of the node that we are using to deploy our contract. */
	/* This is the endpoint that we are using to connect to the Rinkeby network. */
	/* This is the endpoint of the node that we are using to deploy our contract. */

	process.env.APP_INFURA_ROPSTEN_URL
	// remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();
	console.log(accounts);
	fs.writeFileSync('./abi.json', JSON.stringify(abi));

	console.log('Attempting to deploy from account', accounts[1]);

	const result = await new web3.eth.Contract(abi)
		.deploy({ data: bytecode })
		.send({ gas: '1000000', from: accounts[1] });

	console.log('Contract deployed to', result.options.address);
	provider.engine.stop();
};
deploy();
