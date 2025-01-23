const { MongoClient } = require("mongodb");
const serverInfo = require("../_config/config");

const uri = `${serverInfo.db.server}://${serverInfo.db.user}:${serverInfo.db.password}@${serverInfo.db.host}/${serverInfo.db.database}`;
const client = new MongoClient(uri);

async function run() {
	try {
		await client.connect();

		const database = client.db(serverInfo.db.database);
		const companysCollection = database.collection("companys");

		const companysData = [
			{
				companyName: "you services",
				password: "company_password",
				isConfirmed: false,
				createdAt: "2024-12-18T10:30:00Z",
			},
			{
				companyName: "innoya services",
				password: "company_password",
				isConfirmed: false,
				createdAt: "2024-12-18T10:30:00Z",
			},
		];

		if (companysData.length === 0) {
			console.error(
				"Le tableau companysData est vide. Aucun document à insérer."
			);
			return;
		}

		// Vider la collection avant d'ajouter les nouvelles données
		const deleteResult = await companysCollection.deleteMany({});
		console.log(`${deleteResult.deletedCount} documents ont été supprimés.`);

		// Insertion des nouvelles données
		const insertResult = await companysCollection.insertMany(companysData);
		console.log(`${insertResult.insertedCount} documents ont été insérés.`);
	} catch (error) {
		console.error("Erreur lors de la mise à jour : ", error);
	} finally {
		await client.close();
	}
}

run().catch(console.dir);
