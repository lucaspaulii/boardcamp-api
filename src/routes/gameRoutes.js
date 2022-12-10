import { Router } from 'express';
import { getGames, postGame } from '../controllers/gamesControllers.js';
import { validateGame } from '../middlewares/validateGame.js';

const router = Router();

router.get("/games", getGames);

router.post("/games", validateGame, postGame);

export default router;