import  { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import api from "../api";
  
const TeacherBarChart = () => {
  const [enrollStatistics, setEnrollStatistics] = useState([])
  const fetchEnrollmentStatistics = async ()=>{
  try {
   const {data} = await api.get('courses/enrollments/statistics/')
   setEnrollStatistics(data)
   console.log(data)
  } catch (error) {
   console.error(error)
  }
 }
 
 useEffect(()=>{
  fetchEnrollmentStatistics()
 },[])
  const options = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false, // change to true for horizontal bar
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: enrollStatistics.map((enrollment)=> enrollment.course__name)
    },
    title: {
      text: "Student Scores",
      align: "center",
    }
  };

  const series = [
    {
      name: "Score",
      data: enrollStatistics.map((enrollment)=> enrollment.student_count)
    }
  ];

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <Chart
        options={options}
        series={series}
        type="bar"
        height={300}
      />
    </div>
  );
};

export default TeacherBarChart;
