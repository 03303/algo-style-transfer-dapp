const AlgoSigner = window.AlgoSigner;

async function AlgoSignerConnect() {
	let ok = false;
	if (AlgoSigner) {
		try {
			await AlgoSigner.connect()
				.then((d) => {
					ok = true;
				})
				.catch((e) => {
					console.error(e);
				});
		} catch (error) {
			console.error(error);
		}
	}
	else {
		console.error('AlgoSigner not installed!')
	}
	return ok;
}

async function AlgoSignerAccounts() {
	let accounts = {};
	await AlgoSigner.accounts({
			ledger: 'TestNet'
		})
		.then((d) => {
			accounts = d;
		})
		.catch((e) => {
			console.error(e);
		})
	return accounts;
}

async function AlgoSignerGetTxParams() {
	let txParams = {};
	await AlgoSigner.algod({
		ledger: 'TestNet',
		path: '/v2/transactions/params'
	})
	.then((d) => {
		txParams = d;
	})
	.catch((e) => {
		console.error(e);
	});
	return txParams
}

async function AlgoSignerSign(params) {
	let signedTx = {};
	const { from, to, amount, note } = params;
	const txParams = await AlgoSignerGetTxParams();
	if (txParams) {
		await AlgoSigner.sign({
				from: from,
				to: to,
				amount: amount,
				note: note,
				type: 'pay',
				fee: txParams['min-fee'],
				firstRound: txParams['last-round'],
				lastRound: txParams['last-round'] + 1000,
				genesisID: txParams['genesis-id'],
				genesisHash: txParams['genesis-hash'],
				flatFee: true
			})
			.then((d) => {
				signedTx = d;
			})
			.catch((e) => {
				console.error(e);
			});
	}
	return signedTx;
}

async function AlgoSignerSendTx(signedTx) {
	let sentTx = {};
	await AlgoSigner.send({
			ledger: 'TestNet',
			tx: signedTx.blob
		})
		.then((d) => {
			sentTx = d;
		})
		.catch((e) => {
			console.error(e);
		});
	return sentTx;
}

async function AlgoSignerCheckTx(tx) {
	let txStatus = {};
	await AlgoSigner.algod({
			ledger: 'TestNet',
			path: '/v2/transactions/pending/' + tx.txId
		})
		.then((d) => {
			txStatus = d;
		})
		.catch((e) => {
			console.error(e);
		});
	return txStatus;
}

export {
  AlgoSignerConnect,
  AlgoSignerAccounts,
  AlgoSignerGetTxParams,
  AlgoSignerSign,
  AlgoSignerSendTx,
  AlgoSignerCheckTx
};