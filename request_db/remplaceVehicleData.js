const { MongoClient } = require("mongodb");
const serverInfo = require("../_config/config");

const uri = `${serverInfo.db.server}://${serverInfo.db.user}:${serverInfo.db.password}@${serverInfo.db.host}/${serverInfo.db.database}`;
const client = new MongoClient(uri);

async function run() {
	try {
		await client.connect();

		const database = client.db(serverInfo.db.database);
		const vehiclesCollection = database.collection("vehicles");

		const vehiclesData = [
			{
				navigation: {
					showDetails: false,
				},
				options: {
					autoGpsEnabled: false,
				},
				gpsTracker: {
					initialLocation: {
						latitude: "43.472388",
						longitude: "1.301807",
					},
					lastLocation: {
						latitude: "43.61683968706096",
						longitude: "1.3959503173828125",
						timestamp: "2024-10-29T13:55:00.808Z",
					},
					number: "teltonika-1",
				},
				vehicleInformations: {
					licensePlate: "AB-001-CD",
					year: 2021,
					capacity: 5,
					color: "blue",
					manufacturer: "citroen",
					model: "c3",
				},
				assignedEmployee: {
					id: 2,
					name: "Paul MARTIN",
					role: "chauffeur",
					phoneNumber: "+33611111111",
					email: "paul.martin@locate-them.fr",
				},
				vehicleStatus: {
					engineOn: false,
				},
			},
			{
				navigation: {
					showDetails: false,
				},
				options: {
					autoGpsEnabled: false,
				},
				gpsTracker: {
					initialLocation: {
						latitude: "43.472388",
						longitude: "1.301807",
					},
					lastLocation: {
						latitude: "43.61671932350833",
						longitude: "1.3961327075958254",
						timestamp: "2024-10-29T13:55:00.808Z",
					},
					number: "teltonika-2",
				},
				vehicleInformations: {
					licensePlate: "XY-456-ZT",
					year: 2016,
					capacity: 5,
					color: "white",
					manufacturer: "peugeot",
					model: "5008",
				},
				assignedEmployee: {
					id: 3,
					name: "Sophie DURAND",
					role: "chauffeur",
					phoneNumber: "+33622222222",
					email: "sophie.durand@locate-them.fr",
				},
				vehicleStatus: {
					engineOn: false,
				},
			},
			{
				navigation: {
					showDetails: false,
				},
				options: {
					autoGpsEnabled: false,
				},
				gpsTracker: {
					initialLocation: {
						latitude: "43.472388",
						longitude: "1.301807",
					},
					lastLocation: {
						latitude: 43.61652130552657,
						longitude: 1.396395564079285,
						timestamp: "2024-10-29T13:55:00.808Z",
					},
					number: "teltonika-3",
				},
				vehicleInformations: {
					licensePlate: "ZX-789-BY",
					year: 2020,
					capacity: 5,
					color: "black",
					manufacturer: "renault",
					model: "clio",
				},
				assignedEmployee: {
					id: 4,
					name: "Amélie BONNET",
					role: "chauffeur",
					phoneNumber: "+33633333333",
					email: "amelie.bonnet@locate-them.fr",
				},
				vehicleStatus: {
					engineOn: false,
				},
			},
			{
				navigation: {
					showDetails: false,
				},
				options: {
					autoGpsEnabled: false,
				},
				gpsTracker: {
					initialLocation: {
						latitude: "43.472388",
						longitude: "1.301807",
					},
					lastLocation: {
						latitude: 43.54995983738993,
						longitude: 1.384309530258179,
						timestamp: "2024-10-29T13:55:00.808Z",
					},
					number: "teltonika-4",
				},
				vehicleInformations: {
					licensePlate: "MN-654-RD",
					year: 2018,
					capacity: 9,
					color: "grey",
					manufacturer: "mercedes",
					model: "vito",
				},
				assignedEmployee: {
					id: 5,
					name: "Julien LEROY",
					role: "chauffeur",
					phoneNumber: "+33644444444",
					email: "julien.leroy@locate-them.fr",
				},
				vehicleStatus: {
					engineOn: false,
				},
			},
			{
				navigation: {
					showDetails: false,
				},
				options: {
					autoGpsEnabled: false,
				},
				gpsTracker: {
					initialLocation: {
						latitude: "43.472388",
						longitude: "1.301807",
					},
					lastLocation: {
						latitude: 43.47184765950205,
						longitude: 1.3006675243377688,
						timestamp: "2024-10-29T13:55:00.808Z",
					},
					number: "teltonika-5",
				},
				vehicleInformations: {
					licensePlate: "QR-852-JK",
					year: 2015,
					capacity: 4,
					color: "green",
					manufacturer: "ford",
					model: "fiesta",
				},
				assignedEmployee: {
					id: 6,
					name: "Emma MARTINEZ",
					role: "chauffeur",
					phoneNumber: "+33655555555",
					email: "emma.martinez@locate-them.fr",
				},
				vehicleStatus: {
					engineOn: false,
				},
			},
			{
				navigation: {
					showDetails: false,
				},
				options: {
					autoGpsEnabled: false,
				},
				gpsTracker: {
					initialLocation: {
						latitude: "43.472388",
						longitude: "1.301807",
					},
					lastLocation: {
						latitude: 43.471987772819844,
						longitude: 1.3006675243377688,
						timestamp: "2024-10-29T13:55:00.808Z",
					},
					number: "teltonika-6",
				},
				vehicleInformations: {
					licensePlate: "LP-963-QW",
					year: 2014,
					capacity: 6,
					color: "silver",
					manufacturer: "opel",
					model: "zafira",
				},
				assignedEmployee: {
					id: 7,
					name: "Antoine LEBLANC",
					role: "chauffeur",
					phoneNumber: "+33666666666",
					email: "antoine.leblanc@locate-them.fr",
				},
				vehicleStatus: {
					engineOn: false,
				},
			},
			{
				navigation: {
					showDetails: false,
				},
				options: {
					autoGpsEnabled: false,
				},
				gpsTracker: {
					initialLocation: {
						latitude: "43.472388",
						longitude: "1.301807",
					},
					lastLocation: {
						latitude: 43.471979988755145,
						longitude: 1.3008069992065432,
						timestamp: "2024-10-29T13:55:00.808Z",
					},
					number: "teltonika-7",
				},
				vehicleInformations: {
					licensePlate: "TS-741-GF",
					year: 2021,
					capacity: 5,
					color: "yellow",
					manufacturer: "toyota",
					model: "yaris",
				},
				assignedEmployee: {
					id: 8,
					name: "Nina DUBOIS",
					role: "chauffeur",
					phoneNumber: "+33677777777",
					email: "nina.dubois@locate-them.fr",
				},
				vehicleStatus: {
					engineOn: false,
				},
			},
			{
				navigation: {
					showDetails: false,
				},
				options: {
					autoGpsEnabled: false,
				},
				gpsTracker: {
					initialLocation: {
						latitude: "43.472388",
						longitude: "1.301807",
					},
					lastLocation: {
						latitude: 43.59120399281036,
						longitude: 1.45344614982605,
						timestamp: "2024-10-29T13:55:00.808Z",
					},
					number: "teltonika-8",
				},
				vehicleInformations: {
					licensePlate: "GH-258-RL",
					year: 2019,
					capacity: 5,
					color: "black",
					manufacturer: "audi",
					model: "a3",
				},
				assignedEmployee: {
					id: 9,
					name: "Leo RICHARD",
					role: "chauffeur",
					phoneNumber: "+33688888888",
					email: "leo.richard@locate-them.fr",
				},
				vehicleStatus: {
					engineOn: false,
				},
			},
			{
				navigation: {
					showDetails: false,
				},
				options: {
					autoGpsEnabled: false,
				},
				gpsTracker: {
					initialLocation: {
						latitude: "43.472388",
						longitude: "1.301807",
					},
					lastLocation: {
						latitude: 43.59120787715653,
						longitude: 1.453365683555603,
						timestamp: "2024-10-29T13:55:00.808Z",
					},
					number: "teltonika-9",
				},
				vehicleInformations: {
					licensePlate: "BL-369-VC",
					year: 2017,
					capacity: 8,
					color: "blue",
					manufacturer: "volkswagen",
					model: "transporter",
				},
				assignedEmployee: {
					id: 10,
					name: "Clara MOREAU",
					role: "chauffeur",
					phoneNumber: "+33699999999",
					email: "clara.moreau@locate-them.fr",
				},
				vehicleStatus: {
					engineOn: false,
				},
			},
			{
				navigation: {
					showDetails: false,
				},
				options: {
					autoGpsEnabled: false,
				},
				gpsTracker: {
					initialLocation: {
						latitude: "43.472388",
						longitude: "1.301807",
					},
					lastLocation: {
						latitude: 43.59080390381378,
						longitude: 1.4540845155715945,
						timestamp: "2024-10-29T13:55:00.808Z",
					},
					number: "teltonika-10",
				},
				vehicleInformations: {
					licensePlate: "ZR-147-WD",
					year: 2023,
					capacity: 5,
					color: "orange",
					manufacturer: "fiat",
					model: "500",
				},
				assignedEmployee: {
					id: 11,
					name: "Lucas DUMONT",
					role: "chauffeur",
					phoneNumber: "+33700000000",
					email: "lucas.dumont@locate-them.fr",
				},
				vehicleStatus: {
					engineOn: false,
				},
			},
		];

		if (vehiclesData.length === 0) {
			console.error(
				"Le tableau vehiclesData est vide. Aucun document à insérer."
			);
			return;
		}

		// Vider la collection avant d'ajouter les nouvelles données
		const deleteResult = await vehiclesCollection.deleteMany({});
		console.log(`${deleteResult.deletedCount} documents ont été supprimés.`);

		// Insertion des nouvelles données
		const insertResult = await vehiclesCollection.insertMany(vehiclesData);
		console.log(`${insertResult.insertedCount} documents ont été insérés.`);
	} catch (error) {
		console.error("Erreur lors de la mise à jour : ", error);
	} finally {
		await client.close();
	}
}

run().catch(console.dir);
