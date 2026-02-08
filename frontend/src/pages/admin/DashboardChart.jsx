// src/pages/admin/DashboardChart.jsx
import React, { useMemo, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Gauge } from "@mui/x-charts/Gauge";
import { AiOutlineArrowRight } from "react-icons/ai";

const groupByPeriod = (orders, period) => {
  const map = {};

  orders.forEach((o) => {
    const date = new Date(o.createdAt);
    let key;

    if (period === "week") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split("T")[0];
    } else if (period === "month") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    } else {
      key = date.toISOString().split("T")[0];
    }

    if (!map[key]) {
      map[key] = { date: key, revenue: 0, completed: 0, pending: 0, cancelled: 0 };
    }

    if (o.paymentStatus === "paid") map[key].revenue += o.totalAmount;

    switch (o.orderStatus) {
      case "delivered":
        map[key].completed += 1;
        break;
      case "processing":
        map[key].pending += 1;
        break;
      case "cancelled":
        map[key].cancelled += 1;
        break;
    }
  });

  return Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));
};

const DashboardChart = ({ orders }) => {
  const [period, setPeriod] = useState("day");

  const aggregated = useMemo(() => groupByPeriod(orders, period), [orders, period]);

  // If no data, create placeholder for 7 points
  const placeholder = Array.from({ length: 7 }, (_, i) => i + 1);

  const labels = aggregated.length > 0 ? aggregated.map((i) => i.date) : placeholder.map((i) => `Day ${i}`);
  const revenueData = aggregated.length > 0 ? aggregated.map((i) => i.revenue) : placeholder.map(() => 0);

  const totalCompleted = aggregated.reduce((acc, i) => acc + i.completed, 0);
  const totalPending = aggregated.reduce((acc, i) => acc + i.pending, 0);
  const totalCancelled = aggregated.reduce((acc, i) => acc + i.cancelled, 0);

  const totalOrders = totalCompleted + totalPending + totalCancelled;
  const completedPercent = totalOrders ? (totalCompleted / totalOrders) * 100 : 0;

  return (
    <div className="w-full mt-10 mb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 ">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="mt-2 md:mt-0 border border-gray-300 rounded p-2 text-sm focus:outline-none"
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>

      {/* Charts Flex Container */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Revenue Line Chart */}
        <div className="flex-1 bg-white rounded-md p-6 shadow-lg transition-shadow">
          <h4 className="text-gray-600  mb-4">Revenue Trend</h4>
          <LineChart
            height={250} // smaller height
            xAxis={[{ scaleType: "band", data: labels }]}
            yAxis={[{ min: 0 }]}
            series={[
              {
                data: revenueData,
                label: "Revenue",
                area: true,
                color: "#8b5cf6", 
              },
            ]}
            sx={{
              "& .MuiLineSeries-line": { strokeWidth: 2 },
              "& .MuiLineSeries-point": { r: 4 },
              "& .MuiXAxis-axisLine, & .MuiYAxis-axisLine": { stroke: "#e5e7eb" },
            }}
          />
        </div>

        

       {/* Orders Gauge Chart */}
       <div className="w-full md:w-1/3 flex flex-col gap-4 bg-white rounded-md shadow-lg transition-shadow">
       <div className="relative bg-purple-900 text-white rounded-md p-6 flex flex-col gap-1 font-light overflow-hidden">
        {/* Image on the right side */}
        <div
        className="absolute top-0 right-0 h-full w-1/3 bg-no-repeat bg-contain bg-right opacity-70 pointer-events-none"
        style={{ backgroundImage:"url('/img.png')",}}></div>

  {/* Content */}
  <div className="relative flex flex-col gap-3">
    <h3 className="font-light text-lg">Need More Stats?</h3>
    <p className="font-light text-sm">Update to pro for added benefits</p>
    <button className="bg-purple-400 w-fit p-2 font-light rounded-md flex items-center gap-2 cursor-pointer"
    onClick={()=> alert('Coming Soon..')}>
      Go to pro <AiOutlineArrowRight size={18} />
    </button>
  </div>
</div>




  <div className="bg-white rounded-md p-6  flex flex-col justify-center items-center">
        <h4 className="text-gray-600 font-semibold mb-4 text-center">Orders Completion Gauge</h4>
    <Gauge
      value={completedPercent}
      startAngle={-110}
      endAngle={110}
      color={'red'}
      sx={{
        [`& .MuiGauge-valueText`]: { fontSize: 30, fontWeight: "600" },
      }}
      text={({ value }) => `${Math.round(value)}% Completed`}
    />
    <div className="mt-4 flex justify-around w-full text-sm text-gray-500">
      <span>✅ Completed: {totalCompleted}</span>
      <span>⏳ Pending: {totalPending}</span>
      <span>❌ Cancelled: {totalCancelled}</span>
    </div>
  </div>
  
     </div>

      </div>
    </div>
  );
};

export default DashboardChart;
