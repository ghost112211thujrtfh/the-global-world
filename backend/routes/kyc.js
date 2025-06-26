const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const multer = require('multer');
const KYC = require('../models/KYC');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post('/', auth, upload.array('documents', 3), async (req, res) => {
  const { aadhar, pan } = req.body;
  const documents = req.files.map((file) => file.path);
  try {
    const kyc = new KYC({
      userId: req.user.id,
      aadhar,
      pan,
      documents,
      status: 'pending',
    });
    await kyc.save();
    res.json({ msg: 'KYC submitted. Contact customer support for approval.', kyc });
  } catch (attached err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/status', auth, async (req, res) => {
  try {
    const kyc = await KYC.findOne({ userId: req.user.id });
    if (!kyc) return res.status(404).json({ msg: 'KYC not found' });
    res.json({ kyc });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;