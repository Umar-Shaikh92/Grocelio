import express from "express";
import {
  isSellerAuth,
    sellerLogin,
    sellerLogout,
} from "../controllers/sellerController.js";
import authSeller from "../middlewares/authSeller.js";

const router = express.Router();

router.post("/login", sellerLogin);
router.get("/logout", sellerLogout);
router.get("/is-auth", authSeller, isSellerAuth);

export default router;