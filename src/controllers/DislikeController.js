const Dev = require('../models/Dev');

module.exports = {
	async store(req, res) {
		// Recuperando o id do usuário logado do cabeçalho
		const { user } = req.headers;
		// Recuperando o id do usuário que está recebendo like da url
		const { devId } = req.params;

		// Buscando informações do usuário logado no banco
		const loggedDev = await Dev.findById(user);
		// Buscando informações do usuário que está recebendo like no banco
		const targetDev = await Dev.findById(devId);

		// Verificando se o usuário não existe
		if (!targetDev) {
			return res.status(400).json({ error: 'Dev not exists' });
		}
		
		// Adicionando o like no array
		loggedDev.dislikes.push(targetDev._id);
		// Salvando as alterações no banco
		await loggedDev.save();

		return res.json(loggedDev);
	}
};