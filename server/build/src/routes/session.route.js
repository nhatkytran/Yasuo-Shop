"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateResource_1 = __importDefault(require("../middleware/validateResource"));
const session_schema_1 = require("../schemas/session.schema");
const session_controller_1 = require("../controllers/session.controller");
const sessionRouter = express_1.default.Router({ mergeParams: true });
// Signin: Local, Goole. Sign jasonwebtoken, session,...
sessionRouter.post('/signin', (0, validateResource_1.default)(session_schema_1.signinUserSchema), session_controller_1.signin);
// Sessions: Get, Delete, Deactivate (Update), Create (signin creates session)
sessionRouter.use(session_controller_1.protect, (0, session_controller_1.restrictTo)('admin'));
sessionRouter
    .route('/')
    // api/v1/users/:userID/sessions
    // Get all sessions (also for one user)
    .get((0, validateResource_1.default)(session_schema_1.getAllSessionsSchema), session_controller_1.getAllSessions)
    // Deactivate all sessions except for admin
    // Deactivate all sessions for one user (also for admin)
    .patch((0, validateResource_1.default)(session_schema_1.getAllSessionsSchema), session_controller_1.deactivateAllSessions)
    // Delete all sessions except for admin
    // Delete all sessions for one user (also for admin)
    .delete(session_controller_1.deleteAllSessions);
sessionRouter
    .route('/:sessionID')
    // api/v1/users/:userID/sessions/:sessionID
    // Get a specific session by sessionID or sessionID with userID
    // Deactivate and Delete only uses sessionID
    .get((0, validateResource_1.default)(session_schema_1.getSessionSchema), session_controller_1.getSession)
    .patch((0, validateResource_1.default)(session_schema_1.getSessionSchema), session_controller_1.deactivateSession)
    .delete((0, validateResource_1.default)(session_schema_1.getSessionSchema), session_controller_1.deleteSession);
exports.default = sessionRouter;
