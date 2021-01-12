class Controller {
	static instance;

	constructor() {
		if (Controller.instance) {
			return Controller.instance;
		}
		Controller.instance = this;
	}

	getPing(req, res) {
		try {
			res.status(200).json({ massage: 'PING' });
		} catch (ex) {
			const err = `Failed will trying get ping, Error: ${JSON.stringify(ex)}`;
			console.error(err);
			res.status(500).json({ message: err });
		}
	}
}

export default Controller;
