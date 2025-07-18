const express = require('express');

const router = express.Router();

const {register , login} = require('../controllers/authcontroller');
const { protect, authorize } = require('../middleware/authmiddleware');
router.post('/register', register);
router.post('/login', login);

router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ msg: `Welcome Admin: ${req.user.id}` });
});




module.exports = router;
