export const buildCAClient = (FabricCAServices, ccp, caHostName) => {
    // Create a new CA client for interacting with the CA.
	const caInfo = ccp.certificateAuthorities[caHostName]; //lookup CA details from config
	const caTLSCACerts = caInfo.tlsCACerts.pem;
	const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

	console.log(`Built a CA Client named ${caInfo.caName}`);
	return caClient;
};

export const enrollAdmin = async (caClient, wallet, hospMspId, adminAccount) => {
    try {
		// Check to see if we've already enrolled the admin user.
		const identity = await wallet.get(adminAccount.username);
		if (identity) {
			console.log('An identity for the admin user already exists in the wallet');
			return;
		}

		// Enroll the admin user, and import the new identity into the wallet.
		const enrollment = await caClient.enroll({ enrollmentID: adminAccount.username, enrollmentSecret: adminAccount.password });
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: hospMspId,
			type: 'X.509',
		};
		await wallet.put(adminAccount.username, x509Identity);
		console.log('Successfully enrolled admin user and imported it into the wallet');
	} catch (error) {
		console.error(`Failed to enroll admin user : ${error}`);
		process.exit(1);
	}
};

export const registerAndEnrollUser = async (caClient, wallet, adminAccount, userAccount) => {
    const hospMspId = (adminAccount.hospitalID === '1') ? "Hosp1MSP" : "Hosp2MSP";
	try {
        // Check to see if we've already enrolled the user
        const userIdentity = await wallet.get(userAccount.username);
        if (userIdentity) {
            throw new Error(`An identity for the user ${userAccount.username} already exists in the wallet`)
        }

        // Must use an admin to register a new user
		const adminIdentity = await wallet.get(adminAccount.username);
		if (!adminIdentity) {
			throw new Error(`An identity for the admin user ${adminAccount.username} does not exist in the wallet`);
		}

		// build a user object for authenticating with the CA
		const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
		const adminUser = await provider.getUserContext(adminIdentity, adminAccount.username);

		// Get all the parameters from the JSON string
		const speciality = (userAccount.role === 'doctor') ? userAccount.speciality : '';
		const registerAttribute = [
			{
				name: 'username',
				value: userAccount.username,
				ecert: true
			},
			{
				name: 'name',
				value: userAccount.name,
				ecert: true
			},
			{
				name: 'role',
				value: userAccount.role,
				ecert: true
			},
			{
				name: 'speciality',
				value: speciality,
				ecert: true
			}
		]

		// Register the user, enroll the user, and import the new identity into the wallet.
		// if affiliation is specified by client, the affiliation value must be configured in CA
		const secret = await caClient.register({
			enrollmentID: userAccount.username,
			role: 'client',
			attrs: registerAttribute
		}, adminUser);

		const enrollment = await caClient.enroll({
			enrollmentID: userAccount.username,
			enrollmentSecret: secret
		});

		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: hospMspId,
			type: 'X.509',
		};

		await wallet.put(userAccount.username, x509Identity);
        console.log(`Successfully registered and enrolled user ${userAccount.username} and imported it into the wallet`);   
    } catch (error) {
        console.error(`Failed to register user - CAUtils: ${error}`);
		process.exit(1);
	}
};