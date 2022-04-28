import React, { useEffect, useState } from 'react';
import './App.css';

import lottery from './tools/Lottery';
import web3 from './tools/web3';

function App() {
	const [manager, setManager] = useState(0);
	const [players, setPlayers] = useState(0);
	const [balance, setBalance] = useState(0);
	const [value, setValue] = useState(0);
	const [state, setState] = useState(null);

	useEffect(() => {
		const init = async () => {
			console.log('begin');

			const manager = await lottery.methods.manager().call();
			const players = await lottery.methods.getPlayers().call();
			const balance = await web3.eth.getBalance(lottery.options.address);

			console.log('here');
			setManager(manager);
			setPlayers(players);
			setBalance(balance);
		};
		init();
	}, []);

	const onSubmit = async (event) => {
		event.preventDefault();

		const accounts = await web3.eth.getAccounts();
		console.log(accounts);
		setState('Waiting for transaction success...');
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei(value, 'ether'),
		});
		setState('Success! You have been entered!');
	};

	const onClick = async (event) => {
		const accounts = await web3.eth.getAccounts();
		setState('Waiting for transaction success...');
		await lottery.methods.pickWinner().send({
			from: accounts[0],
		});
		setState('Success! A winner has been picked!');
	};

	return (
		<div className="App">
			<div>
				<h4>The Contract is managed by {manager}</h4>
				<h5>
					There are currently {players.length} people entered,
					competing to win ether!{' '}
					{web3.utils.fromWei(String(balance), 'ether')} ether!
				</h5>
			</div>
			<hr />
			<form onSubmit={onSubmit}>
				<h4>Want to try your luck?</h4>
				<div>
					<label htmlFor="">Amount of ether to enter</label>
					<input
						type="text"
						onChange={(event) => setValue(event.target.value)}
					/>
				</div>
				<button>Enter</button>
			</form>
			<hr />
			<h4>Ready to pick a winner?</h4>
			<button onClick={onClick}>Pick a winner!</button>
			<hr />
			<h1>{state}</h1>
		</div>
	);
}

export default App;
