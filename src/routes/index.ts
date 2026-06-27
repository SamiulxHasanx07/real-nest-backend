import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy!" });
});

// Import and attach other route modules here later
// e.g., router.use("/auth", authRoutes);

export default router;
