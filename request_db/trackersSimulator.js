const dgram = require("dgram");

// IP_DU_VPS:8080

const SERVER_HOST = "212.227.52.106"; // Adresse du serveur UDP (localhost)
const SERVER_PORT = 8080; // Port du serveur UDP

const client = dgram.createSocket("udp4");

// Fonction pour envoyer des données GPS simulées
function sendMockGPSData() {
	const imei = "123456789012345";
	const tracker = "tracker";
	const date = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12); // Format YYYYMMDDHHMM
	const latitude = (Math.random() * 180 - 90).toFixed(4); // Latitude entre -90 et 90
	const longitude = (Math.random() * 360 - 180).toFixed(4); // Longitude entre -180 et 180
	const speed = (Math.random() * 120).toFixed(2); // Vitesse entre 0 et 120 km/h

	const latDirection = latitude >= 0 ? "N" : "S";
	const lonDirection = longitude >= 0 ? "E" : "W";

	const mockData = `imei:${imei},${tracker},${date},,F,${Math.abs(
		latitude
	).toFixed(4)},${latDirection},${Math.abs(longitude).toFixed(
		4
	)},${lonDirection},${speed},;`;
	client.send(mockData, SERVER_PORT, SERVER_HOST, (err) => {
		if (err) {
			console.error("Erreur lors de l'envoi des données :", err);
		} else {
			console.log("Données envoyées :", mockData);
		}
	});
}

// Envoyer des données toutes les 5 secondes
setInterval(sendMockGPSData, 10000);
