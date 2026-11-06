const express = require("express");
const router = express.Router();

const leadsController = require("./leads.controller");

router.get("/", leadsController.getLeads);

module.exports = router;