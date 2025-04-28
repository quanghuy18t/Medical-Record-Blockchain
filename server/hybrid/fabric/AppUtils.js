import fs from 'fs';
import path from 'path';

export const buildCCPHosp1 = () => {
    // load the common connection configuration file
	const ccpPath = path.resolve('..', '..', 'MedicalRecord', 'fabric-network', 'organizations', 'peerOrganizations', 'hosp1.quanghuy.com', 'connection-hosp1.json');
	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}
	const contents = fs.readFileSync(ccpPath, 'utf8');

	// build a JSON object from the file contents
	const ccp = JSON.parse(contents);

	console.log(`Loaded the network configuration located at ${ccpPath}`);
	return ccp;
}

export const buildCCPHosp2 = () => {
    // load the common connection configuration file
	const ccpPath = path.resolve('..', '..', 'MedicalRecord', 'fabric-network', 'organizations', 'peerOrganizations', 'hosp2.quanghuy.com', 'connection-hosp2.json');
	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}
	const contents = fs.readFileSync(ccpPath, 'utf8');

	// build a JSON object from the file contents
	const ccp = JSON.parse(contents);

	console.log(`Loaded the network configuration located at ${ccpPath}`);
	return ccp;
}

export const buildWallet = async (Wallets, walletPath) => {
    // Create a new  wallet : Note that wallet is for managing identities.
	let wallet;
	if (walletPath) {
		wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`Built a file system wallet at ${walletPath}`);
	} else {
		wallet = await Wallets.newInMemoryWallet();
		console.log('Built an in memory wallet');
	}

	return wallet;
}

export const prettyJSONString = (inputString) => {
    if (inputString) {
        return JSON.stringify(JSON.parse(inputString), null, 2);
   }
   else {
        return inputString;
   }
}