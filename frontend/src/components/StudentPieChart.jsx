import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../api";
import { useEffect, useState } from "react";
const StudentPieChart = () => {
  const [assignmentStatistics, setAssignmentStatistics] = useState([])
  const fetchAssignmentStatistics = async ()=>{
    try {
     const { data } = await api.get('courses/assignments/statistics/')
     setAssignmentStatistics(data)
     console.log(data)
    } catch (error) {
     console.error(error)
    }
  }  
  const courseHasAssignments = assignmentStatistics.filter((assignment)=> assignment. assignment_count > 0)
  useEffect(()=>{
   fetchAssignmentStatistics()
  },[])

const data = courseHasAssignments.map((course) => ({
  ...course,
  name: course.course__name,
  value: course.assignment_count,
}));


  const COLORS = [
  "#34d399", // green
  "#f87171", // red
  "#60a5fa", // blue
  "#fbbf24", // yellow
  "#a78bfa", // purple
  "#f472b6", // pink
  "#22d3ee", // cyan
  "#c084fc", // violet
  "#facc15", // amber
];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full h-full">
      <h3 className="text-lg font-semibold text-center mb-2">Assignments Status</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) =>
              `${name} (${value}) ${value > 1 ? "Assignments" : "Assignment"}`
            }
            outerRadius={80}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentPieChart;
