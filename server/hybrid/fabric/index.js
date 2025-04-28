import { Gateway, Wallets } from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';
import path from 'path';
import { buildCAClient, enrollAdmin, registerAndEnrollUser } from './CAUtil.js'; 
import { buildCCPHosp1, buildCCPHosp2, buildWallet } from "./AppUtils.js";

const walletPath = path.join(process.cwd(), 'wallet');

export const enrollAdminHosp = async (hospMspId, adminAccount) => {
    try {
        // build an in memory object with the network configuration (also known as a connection profile)
        const ccp = hospMspId === 'Hosp1MSP' ? buildCCPHosp1() : buildCCPHosp2();

        // build an instance of the fabric ca services client based on
		// the information in the network configuration
        const caHostName = hospMspId === 'Hosp1MSP' ? 'ca.hosp1.quanghuy.com' : 'ca.hosp2.quanghuy.com';
		const caClient = buildCAClient(FabricCAServices, ccp, caHostName);

		// setup the wallet to hold the credentials of the application user
        const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, hospMspId, adminAccount);

		console.log(`Successfully enrolled admin user ${adminAccount.username} and imported it into the wallet`);
    } catch (error) {
        console.error(`Failed to enroll admin user ${adminAccount.username} : ${error}`);
    process.exit(1);
    }
};

export const enrollRegisterUser = async (adminAccount, userAccount) => {
    try {
        const wallet = await buildWallet(Wallets, walletPath);
        
        // build an in memory object with the network configuration (also known as a connection profile)
        const ccp = (adminAccount.hospitalID === '1') ? buildCCPHosp1() : buildCCPHosp2();

        // build an instance of the fabric ca services client based on
		// the information in the network configuration
        const caHostName = (adminAccount.hospitalID === '1') ? 'ca.hosp1.quanghuy.com' : 'ca.hosp2.quanghuy.com';
		const caClient = buildCAClient(FabricCAServices, ccp, caHostName);

        await registerAndEnrollUser(caClient, wallet, adminAccount, userAccount);
    } catch (error) {
        console.error(`Failed to register user: ${error}`);
        process.exit(1);
    }
};

export const connectToNetwork = async (userAccount) => {    
    try {
        // setup the wallet to hold the credentials of the application user
        const wallet = await buildWallet(Wallets, walletPath);

        const userIdentity = await wallet.get(userAccount.username);
        if (!userIdentity) {
            throw new Error(`An identity for the user ${userAccount.username} does not exist in the wallet`)
        }

        // Create a new gateway instance for interacting with the fabric network.
        const gateway = new Gateway();
        const ccp = (userAccount.hospitalID === '1') ? buildCCPHosp1() : buildCCPHosp2();

        // setup the gateway instance
        // The user will now be able to create connections to the fabric network and be able to
        // submit transactions and query. All transactions submitted by this gateway will be
        // signed by this user using the credentials stored in the wallet.
        await gateway.connect(ccp, {
            wallet,
            identity: userAccount.username,
            discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
            eventHandlerOptions: { commitTimeout: 300 },
            queryHandlerOptions: { timeout: 120000 }
        });

        // Build a network instance based on the channel where the smart contract is deployed
        const network = await gateway.getNetwork('medicalchannel');

        // Get the contract from the network.
        const contract = network.getContract('medical');

        const networkObj = {
            contract: contract,
            network: network,
            gateway: gateway
        }

        return networkObj;

    } catch (error) {
        throw new Error(`Can not connection network: ${error}`);
    }
};

export const invoke = async (networkObj, isQuery, func, args) => {
    try {
        if (isQuery === true) {
            const result = await networkObj.contract.evaluateTransaction(func, args);
            await networkObj.gateway.disconnect();
            return JSON.parse(result.toString());
        }
        else {
            const result = await networkObj.contract.submitTransaction(func, args);
            await networkObj.gateway.disconnect();
            return result;
        }
    } catch (error) {
        throw new Error(`Failed to submit transaction: ${error}`);
    }
};

export const getDoctorsByHospital = async (networkObj, hospitalID) => {
    // Get the User from the identity context
    const users = networkObj.gateway.identityContext.user;
    const result = [];
    try {
        const ccp = (hospitalID === '1') ? buildCCPHosp1() : buildCCPHosp2();
        const caHostName = hospitalID === '1' ? 'ca.hosp1.quanghuy.com' : 'ca.hosp2.quanghuy.com';
		const caClient = buildCAClient(FabricCAServices, ccp, caHostName);

        // Use the identity service to get the user enrolled using the respective CA
        const idService = caClient.newIdentityService();
        const userList = await idService.getAll(users);

        // for all identities the attrs can be found
        const identities = userList.result.identities;

        for (let i = 0; i < identities.length; i++) {
            let tmp = {};
            if (identities[i].type === 'client') {
                tmp.id = identities[i].id;
                tmp.role = identities[i].type;
                let attributes = identities[i].attrs;

                for (let j = 0; j < attributes.length; j++) {
                    if (attributes[j].name.endsWith('name') || attributes[j].name === 'role' || attributes[j].name === 'speciality'){
                        tmp[attributes[j].name] = attributes[j].value;
                    }
                }

                result.push(tmp);
            }
        }
    } catch (error) {
        throw new Error(`Unable to get all doctors: ${error}`);
    }
    return result.filter((result) => {
        return result.role === 'doctor';
    })
}