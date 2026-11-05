import { useState } from "react";

export function DashboardCharts({ period }: { period: string }) {
  const [metric, setMetric] = useState("Trips");
  const values =
    period === "Last 7 days"
      ? [620, 710, 675, 830, 900, 810, 890]
      : [
          320, 420, 500, 430, 630, 540, 720, 810, 720, 620, 770, 720, 890, 810,
          900,
        ];
  const points = values.map(
    (v, i) => `${56 + (i * 506) / (values.length - 1)},${222 - v * 0.196}`,
  );
  const dates =
    period === "Last 7 days"
      ? ["24 Jan", "25 Jan", "26 Jan", "27 Jan", "28 Jan", "29 Jan", "30 Jan"]
      : ["1 Jan", "5 Jan", "10 Jan", "15 Jan", "20 Jan", "25 Jan", "30 Jan"];
  const legend = [
    ["Car", 62, "#075bff"],
    ["Moto", 18, "#ff8b12"],
    ["Tricycle", 12, "#0eb45c"],
    ["Parcel", 8, "#7950ff"],
  ] as const;
  return (
    <div className="charts-grid">
      <section className="panel chart-panel">
        <div className="panel-head">
          <h3>{metric} Overview</h3>
          <select
            aria-label="Chart metric"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          >
            <option>Trips</option>
            <option>Revenue</option>
          </select>
        </div>
        <div className="chart">
          <svg
            viewBox="0 0 580 256"
            role="img"
            aria-label={`${metric} activity for ${period.toLowerCase()}`}
          >
            <defs>
              <linearGradient id="trip-chart-fill" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#75b7ff" stopOpacity=".6" />
                <stop offset="1" stopColor="#dcebff" stopOpacity=".25" />
              </linearGradient>
            </defs>
            {[0, 200, 400, 600, 800, 1000].map((value) => (
              <g key={value}>
                <line
                  x1="56"
                  x2="562"
                  y1={222 - value * 0.196}
                  y2={222 - value * 0.196}
                  stroke="#e7edf6"
                />
                <text x="42" y={226 - value * 0.196} textAnchor="end">
                  {metric === "Trips"
                    ? value.toLocaleString()
                    : `${value / 1000}m`}
                </text>
              </g>
            ))}
            <polygon
              points={`56,222 ${points.join(" ")} 562,222`}
              fill="url(#trip-chart-fill)"
            />
            <polyline
              points={points.join(" ")}
              fill="none"
              stroke="#075bff"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {points.map((point, i) => (
              <circle
                key={i}
                cx={point.split(",")[0]}
                cy={point.split(",")[1]}
                r="2.1"
                fill="#075bff"
              >
                <title>
                  {metric === "Trips"
                    ? `${values[i]} trips`
                    : `${(values[i] * 1000).toLocaleString()} XAF`}
                </title>
              </circle>
            ))}
            {dates.map((label, i) => (
              <text
                key={label}
                x={56 + (i * 506) / 6}
                y="248"
                textAnchor="middle"
              >
                {label}
              </text>
            ))}
          </svg>
        </div>
      </section>
      <section className="panel chart-panel">
        <div className="panel-head">
          <h3>Trips by Vehicle Type</h3>
        </div>
        <div className="donut-area">
          <div
            className="donut"
            role="img"
            aria-label="Car 62%, Moto 18%, Tricycle 12%, Parcel 8%"
          >
            <div>
              <strong>{period === "Last 7 days" ? "3,120" : "12,480"}</strong>
              <span>Trips</span>
            </div>
          </div>
          <div className="donut-legend">
            {legend.map(([label, percent, color]) => (
              <div key={label}>
                <span>
                  <i style={{ background: color }} />
                  {label}
                </span>
                <strong>{percent}%</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
