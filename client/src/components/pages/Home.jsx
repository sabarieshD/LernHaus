import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/Hero/Hero'
import Browse from '../components/Browse/Browse'
import Courses from '../components/Courses/Courses'
import Usp from '../components/Usp/Usp'
import Features from '../components/Features/Features'
import Footer from '../components/Footer/Footer'

const Home = () => {
  return (
    <>
        <Navbar/>
        <Hero/>
        <Browse/>
        <Courses/>
        <Usp/>
        <Features/>
        <Footer/>
    </>
  )
}

export default Home
