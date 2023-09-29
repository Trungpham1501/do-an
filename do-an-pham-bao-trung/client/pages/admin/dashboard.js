import React, { useEffect, useState } from "react";
import Head from "next/head";
import Combobox from "../../components/Combobox/Combobox";

import { ComboboxLabelPositionEnum } from "../../enums/ComboboxEnum";
import { numberWithCommas } from "../../js/commonFn";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { openToastMsg } from "../../slices/toastMsgSlice";
import { ToastMsgStatus } from "../../enums/ToastMsgEnum";
import baseApi from "../../api/BaseApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

const labels = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

const yearLabels = ["2023", "2024", "2025", "2026", "2027"];

const TERM_OPTIONS = [
  {
    _id: "1",
    name: "Tháng",
  },
  {
    _id: "2",
    name: "Năm",
  },
];

const INITIAL_DATA_MONTH = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const INITIAL_DATA_YEAR = [0, 0, 0, 0, 0];

const Dashboard = () => {
  const [selectedTerm, setSelectedTerm] = useState("1");
  const [options, setOptions] = useState({
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Danh thu theo tháng",
        font: {
          size: 24,
        },
        color: "#000",
        padding: {
          bottom: 30,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }

            if (context.parsed.y) {
              label += `${numberWithCommas(context.parsed.y)} VNĐ`;
            }

            return label;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value, index, ticks) {
            if (value) {
              return `${numberWithCommas(value)} VNĐ`;
            }
            return "";
          },
        },
      },
    },
    layout: {
      padding: {
        left: 10,
      },
    },
  });
  const [data, setData] = useState({
    labels,
    datasets: [
      {
        label: "Doanh thu",
        data: INITIAL_DATA_MONTH,
        borderColor: "rgba(37, 99, 235, 0.5)",
        backgroundColor: "rgba(37, 99, 235, 0.9)",
      },
    ],
  });
  const [totalCars, setTotalCars] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState({
    money: 0,
    mark: "VNĐ",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, []);

  const handleChangeTerm = async (e) => {
    setSelectedTerm(e);
    if (e === "1") {
      const res = await baseApi.get("/orders/getTotalRevenue?month=true");
      const formattedData = [...INITIAL_DATA_MONTH];
      res.data.data.map((r) => {
        formattedData[r._id.month - 1] = r.totalRevenue;
      });

      for (let index = formattedData.length - 1; index >= 0; index--) {
        const r = formattedData[index];
        if (r !== 0) {
          formattedData.splice(index + 1);
          break;
        }
      }

      setData({
        labels,
        datasets: [
          {
            label: "Doanh thu",
            data: formattedData,
            borderColor: "rgba(37, 99, 235, 0.5)",
            backgroundColor: "rgba(37, 99, 235, 0.9)",
          },
        ],
      });
      setOptions((prev) => ({
        ...prev,
        plugins: {
          ...prev.plugins,
          title: {
            ...prev.plugins.title,
            text: "Doanh thu theo tháng",
          },
        },
      }));
    } else if (e === "2") {
      const res = await baseApi.get("/orders/getTotalRevenue?year=true");
      const date = new Date();
      const currentYear = date.getFullYear();
      const yearArr = [];
      for (let index = 0; index < 5; index++) {
        yearArr.unshift(currentYear - index);
      }
      console.log(yearArr);
      const formattedData = [...INITIAL_DATA_YEAR];
      res.data.data.map((r) => {
        formattedData[yearArr.findIndex((y) => y === r._id.year)] =
          r.totalRevenue;
      });

      for (let index = formattedData.length - 1; index >= 0; index--) {
        const r = formattedData[index];
        if (r !== 0) {
          formattedData.splice(index + 1);
          break;
        }
      }
      setData({
        labels: yearArr,
        datasets: [
          {
            label: "Doanh thu",
            data: formattedData,
            borderColor: "rgba(37, 99, 235, 0.5)",
            backgroundColor: "rgba(37, 99, 235, 0.9)",
          },
        ],
      });
      setOptions((prev) => ({
        ...prev,
        plugins: {
          ...prev.plugins,
          title: {
            ...prev.plugins.title,
            text: "Doanh thu theo năm",
          },
        },
      }));
    }
  };

  const getData = async () => {
    try {
      const [
        totalProductsRes,
        totalUsersRes,
        totalReviewRes,
        totalRevenueRes,
        totalRevenueChartRes,
      ] = await Promise.all([
        baseApi.get("/products/total"),
        baseApi.get("/users/total"),
        baseApi.get("/reviews/total"),
        baseApi.get("/orders/getTotalRevenue"),
        baseApi.get("/orders/getTotalRevenue?month=true"),
      ]);
      setTotalCars(totalProductsRes.data.data);
      setTotalUsers(totalUsersRes.data.data);
      setTotalReviews(totalReviewRes.data.data);
      let totalRevenue =
        totalRevenueRes.data.data.length > 0
          ? totalRevenueRes.data.data[0].totalRevenue
          : 0;
      let mark = "VNĐ";
      if (totalRevenue >= 1000000000) {
        totalRevenue = (totalRevenue / 1000000000).toFixed(1);
        mark = "Tỉ VNĐ";
      }
      setTotalRevenue({
        money: totalRevenue,
        mark,
      });

      const formattedData = [...INITIAL_DATA_MONTH];
      totalRevenueChartRes.data.data.map((r) => {
        formattedData[r._id.month - 1] = r.totalRevenue;
      });

      for (let index = formattedData.length - 1; index >= 0; index--) {
        const r = formattedData[index];
        if (r !== 0) {
          formattedData.splice(index + 1);
          break;
        }
      }

      setData({
        labels: selectedTerm === "1" ? labels : yearLabels,
        datasets: [
          {
            label: "Doanh thu",
            data: formattedData,
            borderColor: "rgba(37, 99, 235, 0.5)",
            backgroundColor: "rgba(37, 99, 235, 0.9)",
          },
        ],
      });
    } catch (error) {
      console.log(error);
      dispatch(
        openToastMsg({
          msg: "Có lỗi xảy ra",
          status: ToastMsgStatus.Error,
        })
      );
    }
  };

  return (
    <div className="container mx-auto px-6 mt-6">
      <Head>
        <title>Trang chủ</title>
        <link rel="icon" href="/icon.ico" />
      </Head>

      <main className="w-full">
        <div className="grid grid-cols-4 gap-x-6">
          <div className="rounded-md border border-green-600 bg-green-100 py-6 px-6">
            <div className="font-medium mb-2">Số lượng sản phẩm</div>
            <div className="flex items-center">
              <div className="text-xl flex items-center px-3 h-10 mr-2 bg-green-300 text-green-600 rounded-md">
                <i className="fa-solid fa-bag-shopping"></i>
              </div>
              <div className="text-4xl font-medium">
                {numberWithCommas(totalCars)}{" "}
                <span className="text-base font-normal leading-none">
                  Sản phẩm
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-md border border-yellow-600 bg-yellow-100 py-6 px-6">
            <div className="font-medium mb-2">Số lượng người dùng</div>
            <div className="flex items-center">
              <div className="text-xl flex items-center px-3 h-10 mr-2 bg-yellow-300 text-yellow-600 rounded-md">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="text-4xl font-medium">
                {numberWithCommas(totalUsers)}{" "}
                <span className="text-base font-normal leading-none">
                  Người dùng
                </span>{" "}
              </div>
            </div>
          </div>
          <div className="rounded-md border border-red-600 bg-red-100 py-6 px-6">
            <div className="font-medium mb-2">Số lượng đánh giá</div>
            <div className="flex items-center">
              <div className="text-xl flex items-center px-3 h-10 mr-2 bg-red-300 text-red-600 rounded-md">
                <i className="fa-solid fa-building"></i>
              </div>
              <div className="text-4xl font-medium">
                {numberWithCommas(totalReviews)}{" "}
                <span className="text-base font-normal leading-none">
                  Đánh giá
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-md border border-blue-600 bg-blue-100 py-6 px-6">
            <div className="font-medium mb-2">Tổng doanh thu</div>
            <div className="flex items-center">
              <div className="text-xl flex items-center px-3 h-10 mr-2 bg-blue-300 text-blue-600 rounded-md">
                <i className="fa-solid fa-sack-dollar"></i>
              </div>
              <div className="text-4xl font-medium">
                {numberWithCommas(totalRevenue.money)}{" "}
                <span className="text-base font-normal leading-none">
                  {totalRevenue.mark}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 relative">
          <div className="absolute top-0 right-0">
            <Combobox
              id="sort-option"
              name="sort-option"
              items={TERM_OPTIONS}
              value={selectedTerm}
              label="Thống kê theo"
              labelPosition={ComboboxLabelPositionEnum.Left}
              onChange={handleChangeTerm}
            />
          </div>
          <Line options={options} data={data} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
