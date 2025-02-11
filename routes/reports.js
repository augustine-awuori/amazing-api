const express = require("express");

const { Report, validateReport } = require("../models/report");

const router = express.Router();

router.post("/", async (req, res) => {
    const { error } = validateReport(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const report = new Report(req.body);
        await report.save();
        res.status(201).json({ message: "Report submitted successfully", report });
    } catch (err) {
        res.status(500).json({ error: "Failed to submit report" });
    }
});

router.get("/", async (req, res) => {
    try {
        const reports = await Report.find().sort({ timestamp: -1 });
        res.send(reports);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch reports" });
    }
});

module.exports = router;
