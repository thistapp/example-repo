const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

let hotels = [];
let hotelId = 1;

// GET METHOD
app.get("/api/listhotel/:id?", (req, res) => {
	const {id} = req.params;

	if (id) {
		const hotel = hotels.find((h) => h.id === parseInt(id));
		if (!hotel) {
			return res.status(404).json({
				RespCode: 404,
				RespMessage: "Hotel not found",
			});
		}

		return res.json({
			RespCode: 200,
			RespMessage: "success",
			Result: [hotel],
		});
	}

	res.json({
		RespCode: 200,
		RespMessage: "success",
		Result: hotels,
	});
});

app.get("/api/dashboard/hotel", (req, res) => {
	const filterPrice = hotels.sort((a, b) => b.price - a.price);

	const HighHotel = filterPrice[0].name;
	const LowHotel = filterPrice[filterPrice.length - 1].name;
	const Lasted = hotels.sort(
		(a, b) => new Date(b.doingtime).getTime() - new Date(a.doingtime).getTime()
	)[0].doingtime;

	const Dashboard = {
		AllHotel: hotels.length,
		Price: {
			High: HighHotel,
			Low: LowHotel,
		},
		LastHotelAdd: Lasted,
	};

	res.json({
		RespCode: 200,
		RespMessage: "success",
		Result: {
			hotels,
			Dashboard,
		},
	});
});

// POST METHOD
app.post("/api/create/hotel", (req, res) => {
	const {name, price} = req.body;

	if (!name || !price) {
		return res.status(400).json({
			RespCode: 400,
			RespMessage: "Invalid request. 'name' and 'price' are required.",
		});
	}

	const newHotel = {
		id: hotelId++,
		name,
		price,
		doingtime: new Date().toISOString().replace("T", " ").split(".")[0],
	};

	hotels.push(newHotel);

	res.json({
		RespCode: 200,
		RespMessage: "success",
		Result: [newHotel],
	});
});

app.post("/api/search/hotel", (req, res) => {
	const {date} = req.body;

	if (!date) {
		return res.status(400).json({
			RespCode: 400,
			RespMessage: "Invalid request. 'date' is required.",
		});
	}

	const filteredHotels = hotels.filter((hotel) =>
		hotel.doingtime.startsWith(date)
	);

	if (filteredHotels.length === 0) {
		return res.status(404).json({
			RespCode: 404,
			RespMessage: "No hotels found",
		});
	}

	res.json({
		RespCode: 200,
		RespMessage: "success",
		Result: filteredHotels,
	});
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
