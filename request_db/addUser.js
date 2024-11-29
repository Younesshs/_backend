const { MongoClient } = require("mongodb");
const serverInfo = require("../_config/config");

const uri = `${serverInfo.db.server}://${serverInfo.db.user}:${serverInfo.db.password}@${serverInfo.db.host}/${serverInfo.db.database}`;
const client = new MongoClient(uri);

async function run() {
	try {
		await client.connect();

		const database = client.db(serverInfo.db.database);
		const usersCollection = database.collection("users");

		const usersData = [
			{
				_id: "1",
				email: "admin@locatethem.com",
				configurations: {
					theme: "light",
					language: "fr",
					autoLocationTime: true,
				},
				createdAt: "2024-11-29T10:30:00Z",
				updatedAt: "2024-11-29T10:30:00Z",
			},
		];

		if (usersData.length === 0) {
			console.error("Le tableau usersData est vide. Aucun document à insérer.");
			return;
		}

		// Vider la collection avant d'ajouter les nouvelles données
		const deleteResult = await usersCollection.deleteMany({});
		console.log(`${deleteResult.deletedCount} documents ont été supprimés.`);

		// Insertion des nouvelles données
		const insertResult = await usersCollection.insertMany(usersData);
		console.log(`${insertResult.insertedCount} documents ont été insérés.`);
	} catch (error) {
		console.error("Erreur lors de la mise à jour : ", error);
	} finally {
		await client.close();
	}
}

run().catch(console.dir);
