const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
	async index(req, res) {
		const { user } = req.headers;

		const loggedDev = await Dev.findById(user);

		const users = await Dev.find({
			$and: [
				{ _id: { $ne: user } },
				{ _id: { $nin: loggedDev.likes } },
				{ _id: { $nin: loggedDev.dislikes } },
			],
		});

		return res.json(users);
	},

	async store(req, res) {
		const { username } = req.body;
		
		// Verifica se o usuário já está cadastrado no banco
		const userExists = await Dev.findOne({ user: username });
		// Caso esteja, o retorna
		if (userExists) {
			return res.json(userExists);
		}

		// Fazendo a requisição à API do Github
		const response = await axios.get(`https://api.github.com/users/${username}`);
		// Recuperando os dados através da desestruturação
		const { name, bio, avatar_url: avatar } = response.data;

		// Salvando usuário no mondoDB e retornando as informações
		const dev = await Dev.create({
			name,
			user: username,
			bio,
			avatar
		});

		return res.json(dev);
	}
}   