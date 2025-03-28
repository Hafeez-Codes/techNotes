const User = require('../models/User');
const Note = require('../models/Note');
const bcrypt = require('bcrypt');

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
	const users = await User.find().select('-password').lean();
	if (!users?.length) {
		return res.status(400).json({ message: 'No users found' });
	}
	res.json(users);
};

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
	const { username, password, roles } = req.body;

	// Confirm data
	if (!username || !password) {
		return res.status(400).json({ message: 'All fields are required' });
	}

	// Check for duplicates
	const duplicate = await User.findOne({ username })
		.collation({ locale: 'en', strength: 2 })
		.lean()
		.exec();

	if (duplicate) {
		return res.status(409).json({ message: 'Duplicate username' });
	}

	// Hash password
	const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

	const userObject =
		!Array.isArray(roles) || !roles.length
			? { username, password: hashedPwd }
			: { username, password: hashedPwd, roles };

	// Credate and store new user
	const user = await User.create(userObject);

	if (user) {
		// Created
		res.status(201).json({ message: `New user ${username} created` });
	} else {
		res.status(400).json({ message: 'Invalid user data received' });
	}
};

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
	const { id, username, roles, active, password } = req.body;

	// Confirm data
	if (
		!id ||
		!username ||
		!Array.isArray(roles) ||
		!roles.length ||
		typeof active !== 'boolean'
	) {
		return res.status(400).json({ message: 'All fields are required' });
	}

	// Does the user exist to update?
	const user = await User.findById(id).exec();

	if (!user) {
		return res.status(404).json({ message: 'User not found' });
	}

	// Check for duplicate
	const duplicate = await User.findOne({ username })
		.collaction({ locale: 'en', strength: 2 })
		.lean()
		.exec();

	// Allow updates to the original user
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({ message: 'Duplicate username' });
	}

	user.username = username;
	user.roles = roles;
	user.active = active;

	if (password) {
		// Hash password
		user.password = await bcrypt.hash(password, 10); // salt rounds
	}

	const updatedUser = await user.save();

	res.json({ message: `User ${updatedUser.username} updated` });
};

// @desc Delete new user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ message: 'User ID required' });
	}

	const note = await Note.findOne({ user: id }).lean().exec();

	if (note) {
		return res.status(400).json({ message: 'User has assigned notes' });
	}

	const user = await User.findById(id).exec();

	if (!user) {
		return res.status(404).json({ message: 'User not found' });
	}

	const result = await user.deleteOne();

	const reply = `User ${user.username} with ID ${user._id} deleted`;

	res.json(reply);
};

module.exports = {
	getAllUsers,
	createNewUser,
	updateUser,
	deleteUser,
};
