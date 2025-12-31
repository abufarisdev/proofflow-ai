"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type Report = {
  id: string;
  projectName: string;
  repo: string;
  status: string;
};

export default function ReportsList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports");
        setReports(res.data);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p>Loading reports...</p>;

  return (
    <div>
      <h2>Recent Reports</h2>
      <ul>
        {reports.map((r) => (
          <li key={r.id}>
            {r.projectName} — {r.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
