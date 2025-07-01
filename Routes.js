import express from "express";

import {auth, isStudent} from "./Middleware.js";
import { createSession, submitExam, syncTimeExam, viewStudentResult } from "./Controller.js";

const router = express.Router();

router.post('/start/create/session', auth, isStudent, createSession);
router.post('/sync/time/:id', auth, isStudent, syncTimeExam);
router.post('/submit/:id', auth, isStudent, submitExam);

router.get('/student/result/:id', auth, isStudent, viewStudentResult);

export default router;