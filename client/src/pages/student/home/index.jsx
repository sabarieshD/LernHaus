import React, { useContext, useEffect } from "react";
// import Navbar from "../../../components/Navbar/Navbar";
import Hero from "../../../components/Hero/Hero";
import Browse from "../../../components/Browse/Browse";
import Courses from "../../../components/Courses/Courses";
import Usp from "../../../components/Usp/Usp";
import Features from "../../../components/Features/Features";
import Footer from "../../../components/Footer/Footer";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseListService } from "@/services";

const Home = () => {
  const { setStudentViewCoursesList } = useContext(StudentContext);

  useEffect(() => {
    const fetchAllStudentViewCourses = async () => {
      const response = await fetchStudentViewCourseListService();
      if (response?.success) setStudentViewCoursesList(response?.data);
    };

    fetchAllStudentViewCourses();
  }, [setStudentViewCoursesList]);

  return (
    <>
      {/* <Navbar /> */}
      <Hero />
      <Browse />
      <Courses />
      <Usp />
      <Features />
      <Footer />
    </>
  );
};

export default Home;
