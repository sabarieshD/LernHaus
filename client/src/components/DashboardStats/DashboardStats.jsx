import { FaGraduationCap, FaChalkboardTeacher, FaBook, FaDollarSign } from "react-icons/fa";

const statsData = [
  {
    id: 1,
    icon: <FaGraduationCap className="text-blue-500 text-3xl" />,
    count: "4,968",
    title: "New Learners",
    lastMonth: "4203",
  },
  {
    id: 2,
    icon: <FaChalkboardTeacher className="text-blue-500 text-3xl" />,
    count: "324",
    title: "New Trainers",
    lastMonth: "301",
  },
  {
    id: 3,
    icon: <FaBook className="text-green-500 text-3xl" />,
    count: "3,712",
    title: "New Courses",
    lastMonth: "2779",
  },
  {
    id: 4,
    icon: <FaDollarSign className="text-orange-500 text-3xl" />,
    count: "1,054",
    title: "Refunds",
    lastMonth: "1201",
  },
];

const DashboardStats = () => {
  return (
    <div className=" mt-5 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div
            key={stat.id}
            className="flex items-center gap-4 p-4 rounded-lg border shadow-sm bg-white"
          >
            <div className="p-4 border rounded-full">{stat.icon}</div>
            <div>
              <h3 className="text-xl font-semibold">
                {stat.count} <br />
                <span className="text-gray-600">{stat.title}</span>
              </h3>
              <p className="text-gray-400 text-sm">{stat.lastMonth} last month</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
