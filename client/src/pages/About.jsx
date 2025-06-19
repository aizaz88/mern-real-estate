import React from "react";
import { FaHome, FaHeart, FaHandshake } from "react-icons/fa";

function About() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 text-gray-800">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
          About{" "}
          <span className="text-slate-700">
            <span className="text-slate-500">AU</span>-Estate
          </span>
        </h1>
        <p className="text-gray-600 text-md sm:text-lg">
          Your trusted partner in finding dream homes and perfect investment
          properties.
        </p>
      </div>

      {/* About AU-Estate */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-blue-800">Who We Are</h2>
        <p className="text-gray-700 leading-relaxed">
          AU-Estate is a modern real estate platform dedicated to making home
          buying, renting, and selling easier and more transparent. We blend
          smart technology with personalized support to give users a seamless
          property experience across all devices.
        </p>
      </div>

      {/* Mission Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-blue-800">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          To empower people with reliable tools and trusted guidance so they can
          make confident real estate decisions. Whether you're looking for your
          first apartment or expanding your investment portfolio, AU-Estate is
          here to help.
        </p>
      </div>

      {/* Why Choose AU-Estate */}
      <div>
        <h2 className="text-2xl font-semibold text-blue-800 mb-6">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <FaHome className="text-blue-600 text-3xl mb-2" />
            <h3 className="font-semibold text-lg">Modern Listings</h3>
            <p className="text-sm text-gray-600">
              Up-to-date and verified listings with beautiful photos and clear
              pricing.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaHeart className="text-red-500 text-3xl mb-2" />
            <h3 className="font-semibold text-lg">Personalized Support</h3>
            <p className="text-sm text-gray-600">
              We help you at every step — from browsing to closing deals.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaHandshake className="text-green-600 text-3xl mb-2" />
            <h3 className="font-semibold text-lg">Trusted Connections</h3>
            <p className="text-sm text-gray-600">
              We connect you with top agents, sellers, and landlords you can
              rely on.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
