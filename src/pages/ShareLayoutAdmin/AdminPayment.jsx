import React, { useEffect, useState, useRef } from "react";
import { Typography, Row, Col, Card, Table } from "antd";
import axiosClient from "../../api/customFetch";
import { baseURL, payment, users } from "../../api/endPoints";
import Chart from "chart.js/auto";

const { Title, Text } = Typography;

const AdminPayment = () => {
  const [userData, setUserData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [revenueChange, setRevenueChange] = useState([]);
  const chartRef = useRef(null);
  const pieChartRef = useRef(null);
  const chartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  const fetchUserData = async () => {
    try {
      const response = await axiosClient.get(baseURL + payment);
      setPaymentData(response.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosClient.get(baseURL + users);
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderUserName = (user_id) => {
    const user = userData.find((item) => item._id === user_id);
    return user ? user.fullName : "";
  };

  useEffect(() => {
    fetchUserData();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (chartInstance.current !== null) {
      chartInstance.current.destroy();
    }
    const revenueByDate = {};
    paymentData.forEach((payment) => {
      const date = new Date(payment.createdAt).toLocaleDateString();
      revenueByDate[date] = (revenueByDate[date] || 0) + payment.total_price;
    });

    const labels = Object.keys(revenueByDate);
    const data = Object.values(revenueByDate);

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Revenue by day",
            data: data,
            borderColor: "#1890ff",
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "Day",
            },
          },
          y: {
            title: {
              display: true,
              text: "Revenue",
            },
            beginAtZero: true,
          },
        },
      },
    });

    const revenueChanges = [];
    const sortedDates = Object.keys(revenueByDate).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const currentDate = sortedDates[i];
      const nextDate = sortedDates[i + 1];
      const currentRevenue = revenueByDate[currentDate];
      const nextRevenue = revenueByDate[nextDate];
      const percentChange =
        ((nextRevenue - currentRevenue) / currentRevenue) * 100;
      revenueChanges.push({
        date: nextDate,
        percentChange: percentChange.toFixed(2),
      });
    }
    setRevenueChange(revenueChanges);
  }, [paymentData]);

  useEffect(() => {
    if (pieChartInstance.current !== null) {
      pieChartInstance.current.destroy();
    }

    const revenueByUser = {};
    paymentData.forEach((payment) => {
      const userId = payment.user_id;
      const totalPrice = payment.total_price;
      const userName = renderUserName(userId);
      revenueByUser[userName] = (revenueByUser[userName] || 0) + totalPrice;
    });

    const labels = Object.keys(revenueByUser);
    const data = Object.values(revenueByUser);

    const ctx = pieChartRef.current.getContext("2d");
    pieChartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              "#1890ff",
              "#13c2c2",
              "#52c41a",
              "#eb2f96",
              "#fadb14",
              "#722ed1",
              "#f5222d",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
        },
      },
    });
  }, [paymentData, userData]);

  useEffect(() => {
    const userRevenue = {};
    paymentData.forEach((payment) => {
      const userId = payment.user_id;
      const totalPrice = payment.total_price;
      userRevenue[userId] = (userRevenue[userId] || 0) + totalPrice;
    });

    const sortedUsers = Object.keys(userRevenue)
      .sort((a, b) => userRevenue[b] - userRevenue[a])
      .slice(0, 5);
    const topUsersInfo = sortedUsers.map((userId, index) => {
      const fullName = renderUserName(userId);
      const revenue = userRevenue[userId];
      let medalIcon = null;
      if (index === 0) {
        medalIcon = (
          <img
            src="https://img.icons8.com/ios/50/FFD700/gold-medal.png"
            alt="Gold Medal"
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              marginRight: "5px",
              width: 20,
              height: 20,
              marginTop: -5,
            }}
          />
        );
      } else if (index === 1) {
        medalIcon = (
          <img
            src="https://toppng.com/uploads/preview/silver-medal-png-11546974667gebqo9xqni.png"
            alt="Silver Medal"
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              marginRight: "5px",
              width: 20,
              height: 20,
              marginTop: -5,
            }}
          />
        );
      }
      return { userId, fullName, revenue, medalIcon };
    });

    setTopUsers(topUsersInfo);
  }, [paymentData, userData]);

  const renderChangeCell = (value) => {
    const color = value > 0 ? "green" : "red";
    return <div style={{ color }}>{value}%</div>;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => (
        <>
          {record.medalIcon}
          {text}
        </>
      ),
    },
    {
      title: "Payment",
      dataIndex: "revenue",
      key: "revenue",
      render: (text) => <span>{text.toLocaleString()} VND</span>,
    },
  ];

  return (
    <div>
      <Title level={2} style={{ margin: 30 }}>
        Manage Revenues
      </Title>
      <Row gutter={[16, 16]}>
        <Col span={6.5}>
          <Card
            title="Percentage increase/decrease"
            style={{
              textAlign: "center",
            }}
          >
            <Text style={{ fontSize: "24px" }}>
              {revenueChange.length > 0
                ? renderChangeCell(revenueChange[0].percentChange)
                : null}
            </Text>
            <Text>
              {revenueChange.length > 0 ? revenueChange[0].dateRange : null}
            </Text>
          </Card>
          <Card
            title="People with the highest payment"
            style={{ marginTop: "16px" }}
          >
            <Table columns={columns} dataSource={topUsers} pagination={false} />
          </Card>
        </Col>
        <Col span={7}>
          <Card title="Payment per user" style={{ minHeight: "400px" }}>
            <canvas ref={pieChartRef}></canvas>
          </Card>
        </Col>
        <Col span={11}>
          <Card title="Revenue by day" style={{ minHeight: "425px" }}>
            <canvas ref={chartRef}></canvas>
          </Card>
        </Col>
        <Col span={10}></Col>
      </Row>
    </div>
  );
};

export default AdminPayment;
