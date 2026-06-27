import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy!" });
});

// Import routes
import authRoutes from "./auth.route";

// Mount routes
router.use("/auth", authRoutes);

export default router;
