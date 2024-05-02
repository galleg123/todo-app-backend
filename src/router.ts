import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "./modules/middleware";
import { createNewUser, signIn } from "./handlers/user";
import {
  getNoteInvites,
  updateNote,
  getNotes,
  createNote,
  inviteUser,
  acceptInvite,
  declineInvite,
  deleteNote,
} from "./handlers/note";
const router = Router();

router.get("/notes", getNotes);
router.post("/notes", body("title").isString(), handleInputErrors, createNote);
router.put(
  "/note/:id",
  body("status").isBoolean(),
  handleInputErrors,
  updateNote
);
router.get("/notes/invites", getNoteInvites);
router.put(
  "/notes/invite/:id",
  body("userid").isString(),
  handleInputErrors,
  inviteUser
);
router.put(
  "/notes/accept/:id",
  body("userid").isString(),
  handleInputErrors,
  acceptInvite
);
router.put(
  "/notes/decline/:id",
  body("userid").isString(),
  handleInputErrors,
  declineInvite
);
router.delete("/notes/:id", deleteNote);

export default router;
