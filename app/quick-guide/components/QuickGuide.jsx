import React from 'react'
import ZigZagSteps from './ZigZagSteps';

const QuickGuide = () => {

  // quick guide steps
  const steps = [
    {
      shortTitle: "Connect DB",
      title: "Connect Your Database",
      subtitle: "Click the “Connect DB” button to begin linking your data source.",
      image: "/images/quick-guide/step1.webp"
    },
    {
      shortTitle: "Choose DB",
      title: "Choose Your Database Type",
      subtitle: "Connect to MongoDB, MySQL, or any supported database in one click.",
      image: "/images/quick-guide/step2.webp"
    },
    {
      shortTitle: "Generate SQL",
      title: "Generate SQL With a Prompt",
      subtitle: "Describe what you need—e.g., “Show top 3 selling products”—and let AI create the query.",
      image: "/images/quick-guide/step3.webp"
    },
    {
      shortTitle: "View Result",
      title: "View & Export Query Resultsk",
      subtitle: "Run your query to see results in a table and export them instantly as a CSV file.",
      image: "/images/quick-guide/step4.webp"
    },
    {
      shortTitle: "Bar Chart",
      title: "Visualize Data with Bar Charts",
      subtitle: "Convert your query results into an interactive bar chart.",
      image: "/images/quick-guide/step5.webp"
    },
    {
      shortTitle: "Pie Chart",
      title: "Visualize Data with Pie Charts",
      subtitle: "Understand distribution with engaging, auto-generated pie charts.",
      image: "/images/quick-guide/step6.webp"
    }
  ];

  return (
    <div className='h-fit w-full py-14 flex flex-col gap-12 justify-center items-center'>

      {/* heading */}
      <div className='flex gap-2 flex-col items-center'>
        <h2 className='text-4xl'>Quick Guide</h2>
        <p className='text-xl text-gray-400'>Everything You Need to Get Started</p>
      </div>

      {/* guide guide card */}
      <ZigZagSteps steps={steps} />;

    </div>
  )
}

export default QuickGuide