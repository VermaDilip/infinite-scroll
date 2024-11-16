import React from "react";
import './SkeletonLoader.css'; // Import CSS for skeleton loader

const SkeletonLoader = () => {
    return (
      <div className="skeleton-card">
        <div className="skeleton-thumbnail"></div>
        <div className="skeleton-title"></div>
        <div className="skeleton-description"></div>
      </div>
    );
  };
export default SkeletonLoader;
