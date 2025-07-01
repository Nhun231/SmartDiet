const DietPlan = require('../models/dietplan.model');
const User = require('../models/user.model');
const {StatusCodes} = require("http-status-codes");
const express = require('express');
const dietRouter = express.Router();
const allowedRoles = require('../middlewares/allowedRole');
const verifyJWTs = require("../middlewares/verifyJWTs");
const dietPlanController = require("../controllers/dietplan.controller");
dietRouter.post("/createDietPlan", allowedRoles(["user"]),verifyJWTs, dietPlanController.createDietPlan);
